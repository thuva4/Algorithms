#!/usr/bin/env node

/**
 * Migration Script: Language-first -> Category-first structure
 *
 * Copies algorithm files from the old layout:
 *   algorithms/{Language}/{Algorithm}/
 * to the new layout:
 *   algorithms/{category}/{algorithm-slug}/{language}/
 *
 * Uses scripts/algorithm-mapping.json for slug/category lookup.
 * Generates a migration report at docs/plans/migration-report.json.
 */

import { readFileSync, readdirSync, statSync, mkdirSync, copyFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');
const ALGORITHMS_DIR = join(ROOT, 'algorithms');

/** Map old language folder names to new short names. */
const LANGUAGE_MAP = {
  'Java':       'java',
  'Python':     'python',
  'C':          'c',
  'C++':        'cpp',
  'Go':         'go',
  'JavaScript': 'typescript',
  'Kotlin':     'kotlin',
  'Rust':       'rust',
  'Swift':      'swift',
  'Scala':      'scala',
  'C#':         'csharp',
};

/** These languages are deprecated and should be skipped entirely. */
const DEPRECATED_LANGUAGES = new Set([
  'Ruby',
  'Haskell',
  'Perl',
  'Racket',
  'Crystal',
  'BrainFuck',
]);

/** Category directories that already exist and should not be treated as languages. */
const CATEGORY_DIRS = new Set([
  'sorting',
  'searching',
  'graph',
  'backtracking',
  'bit-manipulation',
  'cryptography',
  'data-structures',
  'divide-and-conquer',
  'dynamic-programming',
  'geometry',
  'greedy',
  'math',
  'strings',
  'trees',
]);

/** Non-algorithm entries to skip inside a language directory. */
const SKIP_ENTRIES = new Set([
  'node_modules',
  'package.json',
  'package-lock.json',
  'yarn.lock',
]);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Recursively copy all files from `src` into `dest`, creating directories as
 * needed.  Overwrites existing files.
 */
function copyDirRecursive(src, dest) {
  mkdirSync(dest, { recursive: true });

  const entries = readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else if (entry.isFile()) {
      copyFileSync(srcPath, destPath);
    }
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  // 1. Load mapping
  const mappingPath = join(__dirname, 'algorithm-mapping.json');
  const mapping = JSON.parse(readFileSync(mappingPath, 'utf-8'));

  // 2. Prepare report accumulators
  const migrated = [];   // { from, to }
  const skipped = [];    // { language, reason }
  const errors = [];     // { algorithm, language, error }
  const unmapped = [];   // algorithm names not found in mapping

  // Keep track of unmapped names (deduplicate)
  const unmappedSet = new Set();

  // 3. Read top-level entries in algorithms/
  const topEntries = readdirSync(ALGORITHMS_DIR, { withFileTypes: true });

  for (const langEntry of topEntries) {
    if (!langEntry.isDirectory()) continue;

    const langName = langEntry.name;

    // Skip category directories
    if (CATEGORY_DIRS.has(langName)) continue;

    // Skip deprecated languages
    if (DEPRECATED_LANGUAGES.has(langName)) {
      skipped.push({ language: langName, reason: 'deprecated language' });
      continue;
    }

    // Must be a known language
    const newLang = LANGUAGE_MAP[langName];
    if (!newLang) {
      skipped.push({ language: langName, reason: 'unknown language (not in language map)' });
      continue;
    }

    // 4. Iterate algorithm folders inside this language dir
    const langDir = join(ALGORITHMS_DIR, langName);
    const algoEntries = readdirSync(langDir, { withFileTypes: true });

    for (const algoEntry of algoEntries) {
      if (!algoEntry.isDirectory()) continue;

      const algoName = algoEntry.name;

      // Skip special directories
      if (SKIP_ENTRIES.has(algoName)) continue;

      // 5. Look up mapping
      const info = mapping[algoName];
      if (!info) {
        if (!unmappedSet.has(algoName)) {
          unmappedSet.add(algoName);
          unmapped.push(algoName);
        }
        errors.push({
          algorithm: algoName,
          language: langName,
          error: `No mapping entry found for "${algoName}"`,
        });
        continue;
      }

      const { slug, category } = info;
      const srcDir = join(ALGORITHMS_DIR, langName, algoName);
      const destDir = join(ALGORITHMS_DIR, category, slug, newLang);

      try {
        copyDirRecursive(srcDir, destDir);
        migrated.push({
          from: `algorithms/${langName}/${algoName}`,
          to: `algorithms/${category}/${slug}/${newLang}`,
        });
      } catch (err) {
        errors.push({
          algorithm: algoName,
          language: langName,
          error: err.message,
        });
      }
    }
  }

  // 6. Write migration report
  const report = {
    migrated,
    skipped,
    errors,
    unmapped,
  };

  const reportDir = join(ROOT, 'docs', 'plans');
  mkdirSync(reportDir, { recursive: true });
  const reportPath = join(reportDir, 'migration-report.json');
  writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n', 'utf-8');

  // 7. Print summary
  console.log('');
  console.log('=== Migration Summary ===');
  console.log(`  Migrated : ${migrated.length} algorithm/language combinations`);
  console.log(`  Skipped  : ${skipped.length} language(s)`);
  if (skipped.length > 0) {
    for (const s of skipped) {
      console.log(`             - ${s.language}: ${s.reason}`);
    }
  }
  console.log(`  Errors   : ${errors.length}`);
  if (errors.length > 0) {
    for (const e of errors) {
      console.log(`             - [${e.language}] ${e.algorithm}: ${e.error}`);
    }
  }
  console.log(`  Unmapped : ${unmapped.length} algorithm name(s)`);
  if (unmapped.length > 0) {
    for (const u of unmapped) {
      console.log(`             - ${u}`);
    }
  }
  console.log('');
  console.log(`Report written to: ${reportPath}`);
  console.log('');
}

main();

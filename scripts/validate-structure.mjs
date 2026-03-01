#!/usr/bin/env node

/**
 * Structure Validation Script
 *
 * Validates the repository structure, ensuring all algorithm folders
 * follow the project conventions:
 *   algorithms/{category}/{algorithm-slug}/{language}/
 *
 * Checks:
 *   1. Valid categories under algorithms/
 *   2. Kebab-case naming for algorithm folders
 *   3. Required files: README.md, metadata.yaml, tests/cases.yaml
 *   4. Valid metadata.yaml contents (required fields, valid values)
 *   5. Valid language subdirectories
 *
 * Exit code 1 if any ERRORS, 0 if only WARNINGS or clean.
 */

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');
const ALGORITHMS_DIR = join(ROOT, 'algorithms');

const VALID_CATEGORIES = new Set([
  'sorting',
  'searching',
  'graph',
  'dynamic-programming',
  'trees',
  'strings',
  'math',
  'greedy',
  'backtracking',
  'divide-and-conquer',
  'bit-manipulation',
  'geometry',
  'cryptography',
  'data-structures',
]);

const VALID_LANGUAGES = new Set([
  'python',
  'java',
  'cpp',
  'c',
  'go',
  'typescript',
  'kotlin',
  'rust',
  'swift',
  'scala',
  'csharp',
]);

/** Kebab-case pattern: one or more lowercase-alphanumeric segments joined by hyphens. */
const KEBAB_CASE_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Special (non-language) subdirectories allowed inside an algorithm folder. */
const SPECIAL_SUBDIRS = new Set([
  'tests',
  'docs',
  'assets',
]);

const VALID_DIFFICULTIES = new Set(['beginner', 'intermediate', 'advanced']);

const REQUIRED_METADATA_FIELDS = ['name', 'slug', 'category', 'difficulty', 'tags', 'complexity'];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Return an array of directory names directly inside `dir`.
 * Skips hidden entries (starting with '.') and non-directories.
 */
function listDirs(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter(e => e.isDirectory() && !e.name.startsWith('.'))
    .map(e => e.name);
}

// ---------------------------------------------------------------------------
// Main validation
// ---------------------------------------------------------------------------

function validate() {
  const errors = [];
  const warnings = [];

  // -----------------------------------------------------------------------
  // 1. Check that algorithms/ exists
  // -----------------------------------------------------------------------
  if (!existsSync(ALGORITHMS_DIR)) {
    errors.push('algorithms/ directory does not exist');
    return { errors, warnings };
  }

  // -----------------------------------------------------------------------
  // 2. Validate categories (top-level dirs under algorithms/)
  // -----------------------------------------------------------------------
  const topLevelDirs = listDirs(ALGORITHMS_DIR);

  for (const dirName of topLevelDirs) {
    if (!VALID_CATEGORIES.has(dirName)) {
      errors.push(`Invalid category directory: algorithms/${dirName}`);
    }
  }

  // -----------------------------------------------------------------------
  // 3. Walk each valid category
  // -----------------------------------------------------------------------
  for (const category of topLevelDirs) {
    if (!VALID_CATEGORIES.has(category)) continue;

    const categoryDir = join(ALGORITHMS_DIR, category);
    const algorithmDirs = listDirs(categoryDir);

    for (const algoSlug of algorithmDirs) {
      const algoPath = join(categoryDir, algoSlug);
      const algoLabel = `algorithms/${category}/${algoSlug}`;

      // -----------------------------------------------------------------
      // 3a. Kebab-case naming
      // -----------------------------------------------------------------
      if (!KEBAB_CASE_RE.test(algoSlug)) {
        errors.push(`Algorithm folder is not kebab-case: ${algoLabel}`);
      }

      // -----------------------------------------------------------------
      // 3b. Required files (warnings)
      // -----------------------------------------------------------------
      const readmePath = join(algoPath, 'README.md');
      if (!existsSync(readmePath)) {
        warnings.push(`Missing README.md: ${algoLabel}`);
      }

      const metadataPath = join(algoPath, 'metadata.yaml');
      if (!existsSync(metadataPath)) {
        warnings.push(`Missing metadata.yaml: ${algoLabel}`);
      }

      const testCasesPath = join(algoPath, 'tests', 'cases.yaml');
      if (!existsSync(testCasesPath)) {
        warnings.push(`Missing tests/cases.yaml: ${algoLabel}`);
      }

      // -----------------------------------------------------------------
      // 3c. Validate metadata.yaml if present
      // -----------------------------------------------------------------
      if (existsSync(metadataPath)) {
        try {
          const raw = readFileSync(metadataPath, 'utf-8');
          const meta = parseYaml(raw);

          if (!meta || typeof meta !== 'object') {
            errors.push(`metadata.yaml is not a valid YAML object: ${algoLabel}`);
          } else {
            // Required fields
            for (const field of REQUIRED_METADATA_FIELDS) {
              if (meta[field] === undefined || meta[field] === null) {
                errors.push(`metadata.yaml missing required field "${field}": ${algoLabel}`);
              }
            }

            // Difficulty validation
            if (meta.difficulty !== undefined && meta.difficulty !== null) {
              if (!VALID_DIFFICULTIES.has(meta.difficulty)) {
                errors.push(
                  `metadata.yaml has invalid difficulty "${meta.difficulty}" ` +
                  `(must be beginner, intermediate, or advanced): ${algoLabel}`
                );
              }
            }

            // Complexity sub-fields
            if (meta.complexity !== undefined && meta.complexity !== null) {
              if (typeof meta.complexity !== 'object') {
                errors.push(`metadata.yaml complexity must be an object: ${algoLabel}`);
              } else {
                if (meta.complexity.time === undefined || meta.complexity.time === null) {
                  errors.push(`metadata.yaml complexity missing "time" sub-field: ${algoLabel}`);
                }
                if (meta.complexity.space === undefined || meta.complexity.space === null) {
                  errors.push(`metadata.yaml complexity missing "space" sub-field: ${algoLabel}`);
                }
              }
            }
          }
        } catch (err) {
          errors.push(`metadata.yaml parse error in ${algoLabel}: ${err.message}`);
        }
      }

      // -----------------------------------------------------------------
      // 3d. Validate language subdirectories
      // -----------------------------------------------------------------
      const subDirs = listDirs(algoPath);
      for (const sub of subDirs) {
        if (SPECIAL_SUBDIRS.has(sub)) continue;
        if (!VALID_LANGUAGES.has(sub)) {
          errors.push(`Invalid language directory "${sub}": ${algoLabel}/${sub}`);
        }
      }
    }
  }

  return { errors, warnings };
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

function main() {
  const { errors, warnings } = validate();

  console.log('');
  console.log('=== Structure Validation Report ===');
  console.log('');

  if (errors.length > 0) {
    console.log(`ERRORS (${errors.length}):`);
    for (const e of errors) {
      console.log(`  \u2717 ${e}`);
    }
  } else {
    console.log('ERRORS (0):');
    console.log('  None');
  }

  console.log('');

  if (warnings.length > 0) {
    console.log(`WARNINGS (${warnings.length}):`);
    for (const w of warnings) {
      console.log(`  \u26A0 ${w}`);
    }
  } else {
    console.log('WARNINGS (0):');
    console.log('  None');
  }

  console.log('');

  if (errors.length > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main();

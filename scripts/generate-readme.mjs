#!/usr/bin/env node

/**
 * generate-readme.mjs
 *
 * Scans algorithms/{category}/{algorithm}/{language}/ directories,
 * reads optional metadata.yaml for display names, and generates
 * the root README.md with a per-category table of implementations.
 */

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import YAML from 'yaml';

// ── Configuration ───────────────────────────────────────────────────────────

const ROOT = resolve(import.meta.dirname, '..');
const ALGORITHMS_DIR = join(ROOT, 'algorithms');
const README_PATH = join(ROOT, 'README.md');

/** Ordered list of categories with display names. */
const CATEGORIES = [
  { slug: 'sorting',            display: 'Sorting' },
  { slug: 'searching',          display: 'Searching' },
  { slug: 'graph',              display: 'Graph' },
  { slug: 'dynamic-programming', display: 'Dynamic Programming' },
  { slug: 'trees',              display: 'Trees' },
  { slug: 'strings',            display: 'Strings' },
  { slug: 'math',               display: 'Math' },
  { slug: 'greedy',             display: 'Greedy' },
  { slug: 'backtracking',       display: 'Backtracking' },
  { slug: 'divide-and-conquer', display: 'Divide and Conquer' },
  { slug: 'bit-manipulation',   display: 'Bit Manipulation' },
  { slug: 'geometry',           display: 'Geometry' },
  { slug: 'cryptography',       display: 'Cryptography' },
  { slug: 'data-structures',    display: 'Data Structures' },
];

/** Ordered list of languages: [display name, directory name]. */
const LANGUAGES = [
  ['Python',     'python'],
  ['Java',       'java'],
  ['C++',        'cpp'],
  ['C',          'c'],
  ['Go',         'go'],
  ['TypeScript', 'typescript'],
  ['Kotlin',     'kotlin'],
  ['Rust',       'rust'],
  ['Swift',      'swift'],
  ['Scala',      'scala'],
  ['C#',         'csharp'],
];

// ── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Convert a kebab-case slug to Title Case.
 *   "longest-common-subsequence" -> "Longest Common Subsequence"
 */
function slugToTitle(slug) {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Check whether a directory exists and contains at least one file
 * (not counting sub-directories).
 */
async function dirHasFiles(dirPath) {
  try {
    const entries = await readdir(dirPath, { withFileTypes: true });
    return entries.some(e => e.isFile() && e.name !== '.gitkeep');
  } catch {
    return false;
  }
}

/**
 * Try to read and parse a YAML file; return null on any failure.
 */
async function readYaml(filePath) {
  try {
    const raw = await readFile(filePath, 'utf-8');
    return YAML.parse(raw);
  } catch {
    return null;
  }
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  let totalAlgorithms = 0;
  let totalImplementations = 0;

  /** @type {{ display: string, algorithms: { name: string, langs: boolean[] }[] }[]} */
  const categoryData = [];

  for (const { slug: catSlug, display: catDisplay } of CATEGORIES) {
    const catDir = join(ALGORITHMS_DIR, catSlug);

    // Read algorithm subdirectories inside this category
    let algSlugs;
    try {
      const entries = await readdir(catDir, { withFileTypes: true });
      algSlugs = entries
        .filter(e => e.isDirectory())
        .map(e => e.name)
        .sort();
    } catch {
      // Category directory doesn't exist or is unreadable — skip
      continue;
    }

    /** @type {{ name: string, langs: boolean[] }[]} */
    const algorithms = [];

    for (const algSlug of algSlugs) {
      const algDir = join(catDir, algSlug);

      // Determine display name: prefer metadata.yaml, fall back to slug
      const meta = await readYaml(join(algDir, 'metadata.yaml'));
      const displayName = meta?.name ?? slugToTitle(algSlug);

      // Check each language
      const langs = await Promise.all(
        LANGUAGES.map(([, dirName]) => dirHasFiles(join(algDir, dirName)))
      );

      const implCount = langs.filter(Boolean).length;

      // Only include the algorithm if it has at least one implementation
      if (implCount > 0) {
        algorithms.push({ name: displayName, langs });
        totalAlgorithms += 1;
        totalImplementations += implCount;
      }
    }

    // Only include the category if it has algorithms
    if (algorithms.length > 0) {
      categoryData.push({ display: catDisplay, algorithms });
    }
  }

  // ── Build the Markdown ──────────────────────────────────────────────────

  const langHeaderRow = LANGUAGES.map(([name]) => ` ${name} `).join('|');
  const langSeparator = LANGUAGES.map(() => ':---:').join('|');
  const langDisplayLine = LANGUAGES.map(([name]) => name).join(' | ');

  const lines = [];

  // Header
  lines.push('# Algorithms');
  lines.push('');
  lines.push('> A comprehensive collection of algorithms implemented in 11 programming languages with interactive visualizations.');
  lines.push('');
  lines.push(`**${totalAlgorithms} algorithms** | **${totalImplementations} implementations** | **11 languages**`);
  lines.push('');

  // Languages
  lines.push('## Languages');
  lines.push('');
  lines.push(langDisplayLine);
  lines.push('');

  // Algorithms section
  lines.push('## Algorithms');
  lines.push('');

  for (const { display, algorithms } of categoryData) {
    lines.push(`### ${display}`);
    lines.push('');
    lines.push(`| Algorithm |${langHeaderRow}|`);
    lines.push(`|:---:|${langSeparator}|`);

    for (const { name, langs } of algorithms) {
      const cells = langs
        .map(has => (has ? ' :white_check_mark: ' : ' '))
        .join('|');
      lines.push(`| ${name} |${cells}|`);
    }

    lines.push('');
  }

  // Contributing
  lines.push('## Contributing');
  lines.push('');
  lines.push('See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on adding new algorithms.');
  lines.push('');

  // License
  lines.push('## License');
  lines.push('');
  lines.push('[Apache 2.0](LICENSE)');
  lines.push('');

  const readme = lines.join('\n');

  await writeFile(README_PATH, readme, 'utf-8');
  console.log(`README.md generated: ${totalAlgorithms} algorithms, ${totalImplementations} implementations`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

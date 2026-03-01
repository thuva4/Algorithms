#!/usr/bin/env node

/**
 * scaffold-algorithm.mjs
 *
 * Generates boilerplate for a new algorithm:
 *   - metadata.yaml
 *   - README.md
 *   - tests/cases.yaml
 *   - Empty directories for all 11 languages
 *
 * Usage:
 *   node scripts/scaffold-algorithm.mjs --name "Algorithm Name" --slug algorithm-name --category sorting --difficulty intermediate
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { parseArgs } from 'node:util';

const ROOT = resolve(import.meta.dirname, '..');
const ALGORITHMS_DIR = join(ROOT, 'algorithms');

const VALID_CATEGORIES = [
  'sorting', 'searching', 'graph', 'dynamic-programming', 'trees',
  'strings', 'math', 'greedy', 'backtracking', 'divide-and-conquer',
  'bit-manipulation', 'geometry', 'cryptography', 'data-structures',
];

const VALID_DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];

const LANGUAGE_DIRS = [
  'python', 'java', 'cpp', 'c', 'go', 'typescript',
  'kotlin', 'rust', 'swift', 'scala', 'csharp',
];

// ── Parse arguments ─────────────────────────────────────────────────────────

let args;
try {
  args = parseArgs({
    options: {
      name:       { type: 'string' },
      slug:       { type: 'string' },
      category:   { type: 'string' },
      difficulty: { type: 'string' },
      help:       { type: 'boolean', short: 'h' },
    },
  });
} catch {
  printUsage();
  process.exit(1);
}

if (args.values.help) {
  printUsage();
  process.exit(0);
}

const { name, slug, category, difficulty } = args.values;

if (!name || !slug || !category || !difficulty) {
  console.error('Error: --name, --slug, --category, and --difficulty are all required.\n');
  printUsage();
  process.exit(1);
}

if (!VALID_CATEGORIES.includes(category)) {
  console.error(`Error: Invalid category "${category}". Must be one of: ${VALID_CATEGORIES.join(', ')}`);
  process.exit(1);
}

if (!VALID_DIFFICULTIES.includes(difficulty)) {
  console.error(`Error: Invalid difficulty "${difficulty}". Must be one of: ${VALID_DIFFICULTIES.join(', ')}`);
  process.exit(1);
}

if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
  console.error(`Error: Slug "${slug}" must be kebab-case (lowercase letters, numbers, hyphens).`);
  process.exit(1);
}

// ── Generate files ──────────────────────────────────────────────────────────

const algDir = join(ALGORITHMS_DIR, category, slug);

// Convert slug to a snake_case function name
const functionName = slug.replace(/-/g, '_');

const metadataContent = `name: "${name}"
slug: "${slug}"
category: "${category}"
subcategory: ""
difficulty: "${difficulty}"
tags: []
complexity:
  time:
    best: "O(?)"
    average: "O(?)"
    worst: "O(?)"
  space: "O(?)"
stable: null
in_place: null
related: []
implementations: []
visualization: false
`;

const readmeContent = `# ${name}

## Overview

<!-- 2-3 sentence description of what the algorithm does and when you would use it. -->

## How It Works

<!-- Step-by-step explanation. Walk through a small example showing each step. -->

### Example

Given input: \`...\`

1. Step 1
2. Step 2
3. Step 3

Result: \`...\`

## Pseudocode

\`\`\`
function ${functionName}(input):
    // TODO
\`\`\`

## Complexity Analysis

| Case    | Time  | Space |
|---------|-------|-------|
| Best    | O(?)  | O(?)  |
| Average | O(?)  | O(?)  |
| Worst   | O(?)  | O(?)  |

**Why these complexities?**

<!-- Explain what drives the best/worst case. -->

## When to Use

- TODO

## When NOT to Use

- TODO

## Comparison with Similar Algorithms

| Algorithm | Time (avg) | Space | Stable | Notes |
|-----------|-----------|-------|--------|-------|
| ${name} | O(?) | O(?) | ? | |

## References

- <!-- Link to original paper, textbook, or authoritative source -->
`;

const testCasesContent = `algorithm: "${slug}"
function_signature:
  name: "${functionName}"
  input: []
  output: ""
test_cases:
  - name: "basic case"
    input: []
    expected: null
  - name: "edge case - empty input"
    input: []
    expected: null
  - name: "edge case - single element"
    input: []
    expected: null
  - name: "large input"
    input: []
    expected: null
  - name: "negative numbers"
    input: []
    expected: null
`;

async function main() {
  // Create directory structure
  await mkdir(join(algDir, 'tests'), { recursive: true });

  for (const lang of LANGUAGE_DIRS) {
    await mkdir(join(algDir, lang), { recursive: true });
  }

  // Write template files
  await writeFile(join(algDir, 'metadata.yaml'), metadataContent, 'utf-8');
  await writeFile(join(algDir, 'README.md'), readmeContent, 'utf-8');
  await writeFile(join(algDir, 'tests', 'cases.yaml'), testCasesContent, 'utf-8');

  console.log(`Scaffolded algorithm: ${name}`);
  console.log(`  Location: algorithms/${category}/${slug}/`);
  console.log('');
  console.log('Created:');
  console.log('  metadata.yaml       - Fill in complexity, tags, and related algorithms');
  console.log('  README.md           - Write the algorithm explanation');
  console.log('  tests/cases.yaml    - Define function signature and test cases (min 5)');
  console.log(`  ${LANGUAGE_DIRS.length} language dirs    - Add implementations in any language`);
  console.log('');
  console.log('Next steps:');
  console.log('  1. Fill in metadata.yaml with correct complexity values');
  console.log('  2. Write the README.md explanation with a worked example');
  console.log('  3. Define test cases in tests/cases.yaml');
  console.log('  4. Add at least one language implementation');
  console.log('  5. Run: npm run validate');
}

function printUsage() {
  console.log('Usage:');
  console.log('  node scripts/scaffold-algorithm.mjs --name "Algorithm Name" --slug algorithm-name --category sorting --difficulty intermediate');
  console.log('');
  console.log('Options:');
  console.log('  --name        Human-readable algorithm name (required)');
  console.log('  --slug        Kebab-case identifier (required)');
  console.log('  --category    One of: ' + VALID_CATEGORIES.join(', '));
  console.log('  --difficulty   One of: ' + VALID_DIFFICULTIES.join(', '));
  console.log('  -h, --help    Show this help message');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

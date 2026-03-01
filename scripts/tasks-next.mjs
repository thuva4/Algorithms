#!/usr/bin/env node

/**
 * tasks-next.mjs
 *
 * Finds the next unchecked checklist item across all task files.
 * Gathers context based on item type (documentation, implementation, visualization).
 *
 * Usage:
 *   node scripts/tasks-next.mjs                          # human-readable output
 *   node scripts/tasks-next.mjs --json                   # JSON output
 *   node scripts/tasks-next.mjs --category sorting       # scope to category
 *   node scripts/tasks-next.mjs --algo bubble-sort       # scope to algorithm
 *
 * Exit codes: 0 = found work, 2 = all complete.
 */

import { join } from 'node:path';
import { parseArgs } from 'node:util';
import {
  TASKS_DIR,
  ALGORITHMS_DIR,
  CATEGORIES,
  listFiles,
  tryReadFile,
  parseTaskFile,
} from './tasks-shared.mjs';

// ── Parse arguments ─────────────────────────────────────────────────────────

const args = parseArgs({
  options: {
    json:     { type: 'boolean', default: false },
    category: { type: 'string' },
    algo:     { type: 'string' },
  },
  strict: false,
});

const jsonMode = args.values.json;
const filterCategory = args.values.category;
const filterAlgo = args.values.algo;

// ── Context gathering ───────────────────────────────────────────────────────

function gatherContext(algo, item) {
  const algoDir = join(ALGORITHMS_DIR, algo.category, algo.slug);
  const context = {};

  if (item.text.includes('README')) {
    // Documentation item
    context.type = 'documentation';
    context.readme = tryReadFile(join(algoDir, 'README.md'));
    context.metadata = tryReadFile(join(algoDir, 'metadata.yaml'));
    context.testCases = tryReadFile(join(algoDir, 'tests', 'cases.yaml'));
  } else if (item.text.includes('implementation')) {
    // Implementation item — extract language name
    context.type = 'implementation';
    const langMatch = item.text.match(/^(\S+) implementation/);
    if (langMatch) {
      const displayName = langMatch[1];
      // Map display name back to directory name
      const langMap = {
        'Python': 'python', 'Java': 'java', 'C++': 'cpp', 'C': 'c',
        'Go': 'go', 'TypeScript': 'typescript', 'Kotlin': 'kotlin',
        'Rust': 'rust', 'Swift': 'swift', 'Scala': 'scala', 'C#': 'csharp',
      };
      const langDir = langMap[displayName] || displayName.toLowerCase();
      context.language = langDir;

      // Read code files from language directory
      const langPath = join(algoDir, langDir);
      const files = listFiles(langPath);
      context.codeFiles = {};
      for (const f of files) {
        const content = tryReadFile(join(langPath, f));
        if (content) context.codeFiles[f] = content;
      }

      // Also include test cases and README excerpt
      context.testCases = tryReadFile(join(algoDir, 'tests', 'cases.yaml'));
      const readme = tryReadFile(join(algoDir, 'README.md'));
      if (readme) {
        // Include first ~50 lines as excerpt
        context.readmeExcerpt = readme.split('\n').slice(0, 50).join('\n');
      }
    }
  } else if (item.text.includes('Animation') || item.text.includes('animation')) {
    // Visualization item
    context.type = 'visualization';
    context.metadata = tryReadFile(join(algoDir, 'metadata.yaml'));
    const readme = tryReadFile(join(algoDir, 'README.md'));
    if (readme) {
      context.readmeExcerpt = readme.split('\n').slice(0, 50).join('\n');
    }
    context.visualizationsDir = 'web/src/visualizations/';
  }

  return context;
}

// ── Find next item ──────────────────────────────────────────────────────────

function findNext() {
  const categories = filterCategory ? [filterCategory] : CATEGORIES;

  let totalItems = 0;
  let totalChecked = 0;

  for (const category of categories) {
    const categoryDir = join(TASKS_DIR, category);
    const files = listFiles(categoryDir).filter(f => f.endsWith('.md')).sort();

    for (const file of files) {
      const slug = file.replace('.md', '');
      if (filterAlgo && slug !== filterAlgo) continue;

      const content = tryReadFile(join(categoryDir, file));
      if (!content) continue;

      const parsed = parseTaskFile(content);
      totalItems += parsed.items.length;
      totalChecked += parsed.items.filter(i => i.checked).length;

      for (let i = 0; i < parsed.items.length; i++) {
        const item = parsed.items[i];
        if (!item.checked) {
          return {
            found: true,
            taskFile: join(categoryDir, file),
            taskFileRelative: `docs/tasks/${category}/${file}`,
            algorithm: {
              name: parsed.name,
              slug: parsed.slug || slug,
              category: parsed.category || category,
            },
            item: {
              index: i,
              text: item.text,
            },
            progress: {
              totalItems,
              totalChecked,
              fileItems: parsed.items.length,
              fileChecked: parsed.items.filter(it => it.checked).length,
            },
          };
        }
      }
    }
  }

  return {
    found: false,
    progress: { totalItems, totalChecked },
  };
}

// ── Main ────────────────────────────────────────────────────────────────────

function main() {
  const result = findNext();

  if (!result.found) {
    if (jsonMode) {
      console.log(JSON.stringify({ complete: true, progress: result.progress }, null, 2));
    } else {
      console.log('\nAll tasks complete!');
      console.log(`  ${result.progress.totalChecked}/${result.progress.totalItems} items checked.`);
    }
    process.exit(2);
  }

  // Gather context
  const context = gatherContext(result.algorithm, result.item);

  if (jsonMode) {
    console.log(JSON.stringify({
      complete: false,
      taskFile: result.taskFileRelative,
      algorithm: result.algorithm,
      item: result.item,
      progress: result.progress,
      context,
    }, null, 2));
  } else {
    console.log(`\n─── Next Task ───────────────────────────────────`);
    console.log(`  Algorithm:  ${result.algorithm.name}`);
    console.log(`  Category:   ${result.algorithm.category}`);
    console.log(`  Task file:  ${result.taskFileRelative}`);
    console.log(`  Item #${result.item.index}: ${result.item.text}`);
    console.log(`  Type:       ${context.type || 'unknown'}`);
    console.log(`  Progress:   ${result.progress.fileChecked}/${result.progress.fileItems} in this file`);
    console.log(`─────────────────────────────────────────────────\n`);

    if (context.type === 'implementation' && context.language) {
      console.log(`  Language: ${context.language}`);
      if (context.codeFiles) {
        console.log(`  Code files: ${Object.keys(context.codeFiles).join(', ')}`);
      }
    }
  }

  process.exit(0);
}

main();

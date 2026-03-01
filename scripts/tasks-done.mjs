#!/usr/bin/env node

/**
 * tasks-done.mjs
 *
 * Marks a specific checklist item as done in a task file.
 *
 * Usage:
 *   node scripts/tasks-done.mjs --category sorting --algo bubble-sort --item 0
 *   node scripts/tasks-done.mjs --file docs/tasks/sorting/bubble-sort.md --item 0
 *   node scripts/tasks-done.mjs --last                           # marks what tasks-next would find
 *   node scripts/tasks-done.mjs --last --update-tracker          # also regenerate TRACKER.md
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';
import { parseArgs } from 'node:util';
import {
  ROOT,
  TASKS_DIR,
  CATEGORIES,
  listFiles,
  tryReadFile,
  parseTaskFile,
  updateTaskChecks,
} from './tasks-shared.mjs';

// ── Parse arguments ─────────────────────────────────────────────────────────

const args = parseArgs({
  options: {
    category:       { type: 'string' },
    algo:           { type: 'string' },
    item:           { type: 'string' },
    file:           { type: 'string' },
    last:           { type: 'boolean', default: false },
    'update-tracker': { type: 'boolean', default: false },
  },
  strict: false,
});

const updateTracker = args.values['update-tracker'];

// ── Find the target ─────────────────────────────────────────────────────────

function resolveTarget() {
  // Mode 1: --last (find first unchecked item, same as tasks-next)
  if (args.values.last) {
    const filterCategory = args.values.category;
    const filterAlgo = args.values.algo;
    const categories = filterCategory ? [filterCategory] : CATEGORIES;

    for (const category of categories) {
      const categoryDir = join(TASKS_DIR, category);
      const files = listFiles(categoryDir).filter(f => f.endsWith('.md')).sort();

      for (const file of files) {
        const slug = file.replace('.md', '');
        if (filterAlgo && slug !== filterAlgo) continue;

        const filePath = join(categoryDir, file);
        const content = tryReadFile(filePath);
        if (!content) continue;

        const parsed = parseTaskFile(content);
        for (let i = 0; i < parsed.items.length; i++) {
          if (!parsed.items[i].checked) {
            return { filePath, itemIndex: i };
          }
        }
      }
    }

    console.log('All tasks are complete. Nothing to mark.');
    process.exit(2);
  }

  // Mode 2: --file + --item
  if (args.values.file) {
    const filePath = join(ROOT, args.values.file);
    const itemIndex = parseInt(args.values.item, 10);
    if (isNaN(itemIndex)) {
      console.error('Error: --item is required (integer index) when using --file.');
      process.exit(1);
    }
    return { filePath, itemIndex };
  }

  // Mode 3: --category + --algo + --item
  if (args.values.category && args.values.algo) {
    const filePath = join(TASKS_DIR, args.values.category, `${args.values.algo}.md`);
    const itemIndex = parseInt(args.values.item, 10);
    if (isNaN(itemIndex)) {
      console.error('Error: --item is required (integer index) when using --category + --algo.');
      process.exit(1);
    }
    return { filePath, itemIndex };
  }

  console.error('Error: Use --last, or --file + --item, or --category + --algo + --item.');
  process.exit(1);
}

// ── Main ────────────────────────────────────────────────────────────────────

function main() {
  const { filePath, itemIndex } = resolveTarget();

  if (!existsSync(filePath)) {
    console.error(`Error: Task file not found: ${filePath}`);
    process.exit(1);
  }

  const content = readFileSync(filePath, 'utf-8');
  const parsed = parseTaskFile(content);

  if (itemIndex < 0 || itemIndex >= parsed.items.length) {
    console.error(`Error: Item index ${itemIndex} out of range (0-${parsed.items.length - 1}).`);
    process.exit(1);
  }

  // Idempotent: already checked is a no-op
  if (parsed.items[itemIndex].checked) {
    console.log(`Item #${itemIndex} already checked: ${parsed.items[itemIndex].text}`);
    process.exit(0);
  }

  // Update the checkbox
  const newStates = parsed.items.map((it, i) => i === itemIndex ? true : it.checked);
  const updated = updateTaskChecks(content, newStates);
  writeFileSync(filePath, updated, 'utf-8');

  const relativePath = filePath.replace(ROOT + '/', '');
  console.log(`Marked item #${itemIndex} as done: ${parsed.items[itemIndex].text}`);
  console.log(`  File: ${relativePath}`);
  console.log(`  Algorithm: ${parsed.name || parsed.slug}`);

  const nowChecked = newStates.filter(Boolean).length;
  console.log(`  Progress: ${nowChecked}/${parsed.items.length}`);

  // Optionally regenerate tracker
  if (updateTracker) {
    console.log('\nRegenerating TRACKER.md...');
    execSync('node scripts/tasks-tracker.mjs', { cwd: ROOT, stdio: 'inherit' });
  }
}

main();

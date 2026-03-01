#!/usr/bin/env node

/**
 * tasks-generate.mjs
 *
 * Scans all algorithms and creates one markdown task file per algorithm
 * at docs/tasks/{category}/{slug}.md.
 *
 * Usage:
 *   node scripts/tasks-generate.mjs           # skip existing files
 *   node scripts/tasks-generate.mjs --force    # overwrite existing files
 */

import { mkdir, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import {
  ROOT,
  TASKS_DIR,
  LANGUAGE_DISPLAY,
  walkAllAlgorithms,
} from './tasks-shared.mjs';

// ── Parse arguments ─────────────────────────────────────────────────────────

const args = parseArgs({
  options: {
    force: { type: 'boolean', default: false },
  },
  strict: false,
});

const force = args.values.force;

// ── Template ────────────────────────────────────────────────────────────────

function buildTaskMarkdown(algo) {
  const implLines = algo.implementations
    .map(lang => `- [ ] ${LANGUAGE_DISPLAY[lang]} implementation refactored, documented, tests passing`)
    .join('\n');

  return `# ${algo.name}
<!-- slug: ${algo.slug} | category: ${algo.category} -->

**Difficulty:** ${algo.difficulty} | **Implementations:** ${algo.implementations.length} | **Visualization:** ${algo.hasVisualizationMeta}

## Checklist

### Documentation
- [ ] README complete and accurate

### Implementations
${implLines}

### Visualization
- [ ] Animation added
`;
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  // Delete typo directory if it exists
  const typoDir = join(ROOT, 'docs', 'takss');
  if (existsSync(typoDir)) {
    await rm(typoDir, { recursive: true });
    console.log('Deleted typo directory: docs/takss/');
  }

  const algorithms = walkAllAlgorithms();
  let created = 0;
  let skipped = 0;

  for (const algo of algorithms) {
    const categoryDir = join(TASKS_DIR, algo.category);
    const filePath = join(categoryDir, `${algo.slug}.md`);

    if (!force && existsSync(filePath)) {
      skipped++;
      continue;
    }

    await mkdir(categoryDir, { recursive: true });
    await writeFile(filePath, buildTaskMarkdown(algo), 'utf-8');
    created++;
  }

  console.log(`\nTask generation complete.`);
  console.log(`  Created: ${created}`);
  console.log(`  Skipped: ${skipped} (already exist)`);
  console.log(`  Total algorithms: ${algorithms.length}`);
  console.log(`  Output: ${TASKS_DIR}/`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

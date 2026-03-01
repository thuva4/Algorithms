#!/usr/bin/env node

/**
 * tasks-analyze.mjs
 *
 * Analyzes all algorithms and marks checklist items as done where criteria are met:
 *   - README: has 6+ substantive sections (not placeholder TODOs)
 *   - Implementation: code files exist with 10+ lines of real code
 *   - Visualization: visualization JSON file exists in web/public/data/algorithms/
 *
 * Usage:
 *   node scripts/tasks-analyze.mjs              # dry-run (report only)
 *   node scripts/tasks-analyze.mjs --apply      # actually mark items done
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import {
  ROOT,
  ALGORITHMS_DIR,
  TASKS_DIR,
  CATEGORIES,
  LANGUAGE_DISPLAY,
  ALL_LANGUAGES,
  listDirs,
  listFiles,
  tryReadFile,
  tryParseYaml,
  parseTaskFile,
  updateTaskChecks,
  detectImplementations,
  walkAllAlgorithms,
} from './tasks-shared.mjs';

const args = parseArgs({
  options: { apply: { type: 'boolean', default: false } },
  strict: false,
});
const applyChanges = args.values.apply;

// ── README analysis ─────────────────────────────────────────────────────────

const REQUIRED_SECTIONS = [
  /^##\s+(Overview|Introduction)/im,
  /^##\s+How\s+It\s+Works/im,
  /^##?\s*(Example|Worked Example|Walkthrough)/im,
  /^##\s+(Pseudocode|Algorithm)/im,
  /^##\s+(Complexity|Time Complexity|Complexity Analysis)/im,
  /^##\s+(When to Use|Applications|Use Cases)/im,
  /^##\s+When NOT to Use/im,
  /^##\s+(Comparison|Compared)/im,
  /^##\s+References/im,
];

function analyzeReadme(algoDir) {
  const readme = tryReadFile(join(algoDir, 'README.md'));
  if (!readme) return { pass: false, reason: 'no README.md' };

  // Check for placeholder-only content
  const lines = readme.split('\n');
  const nonEmpty = lines.filter(l => l.trim().length > 0 && !l.startsWith('#'));
  if (nonEmpty.length < 10) return { pass: false, reason: 'too short (< 10 content lines)' };

  // Check for TODO placeholders
  const todoCount = (readme.match(/TODO/gi) || []).length;
  const contentRatio = nonEmpty.length / Math.max(todoCount, 1);
  if (todoCount > 3 && contentRatio < 5) return { pass: false, reason: 'too many TODOs' };

  // Count matching sections
  let sectionCount = 0;
  for (const pattern of REQUIRED_SECTIONS) {
    if (pattern.test(readme)) sectionCount++;
  }

  if (sectionCount >= 6) {
    return { pass: true, reason: `${sectionCount}/9 sections` };
  }
  return { pass: false, reason: `only ${sectionCount}/9 sections` };
}

// ── Implementation analysis ─────────────────────────────────────────────────

const CODE_EXTENSIONS = new Set([
  '.py', '.java', '.cpp', '.cc', '.cxx', '.h', '.hpp',
  '.c', '.go', '.ts', '.js', '.kt', '.rs', '.swift',
  '.scala', '.cs',
]);

function analyzeImplementation(algoDir, lang) {
  const langDir = join(algoDir, lang);
  if (!existsSync(langDir)) return { pass: false, reason: 'no directory' };

  const files = listFiles(langDir).filter(f => {
    const ext = f.substring(f.lastIndexOf('.'));
    return CODE_EXTENSIONS.has(ext);
  });

  if (files.length === 0) return { pass: false, reason: 'no code files' };

  // Check total lines of code across all files
  let totalLines = 0;
  for (const f of files) {
    const content = tryReadFile(join(langDir, f));
    if (content) {
      const codeLines = content.split('\n').filter(l => l.trim().length > 0).length;
      totalLines += codeLines;
    }
  }

  if (totalLines >= 5) {
    return { pass: true, reason: `${totalLines} lines across ${files.length} file(s)` };
  }
  return { pass: false, reason: `only ${totalLines} lines` };
}

// ── Visualization analysis ──────────────────────────────────────────────────

function analyzeVisualization(category, slug) {
  const vizPath = join(ROOT, 'web', 'public', 'data', 'algorithms', category, `${slug}.json`);
  if (!existsSync(vizPath)) {
    return { pass: false, reason: 'no visualization JSON' };
  }
  // Check the "visualization" flag inside the JSON — file existence alone is not enough
  try {
    const data = JSON.parse(readFileSync(vizPath, 'utf-8'));
    if (data.visualization === true) {
      return { pass: true, reason: 'visualization: true' };
    }
    return { pass: false, reason: 'visualization: false in JSON' };
  } catch {
    return { pass: false, reason: 'invalid JSON' };
  }
}

// ── Main ────────────────────────────────────────────────────────────────────

function main() {
  const algorithms = walkAllAlgorithms();
  let totalChecked = 0;
  let totalItems = 0;
  let newlyMarked = 0;

  const summary = { readmePass: 0, readmeFail: 0, implPass: 0, implFail: 0, vizPass: 0, vizFail: 0 };

  for (const algo of algorithms) {
    const taskPath = join(TASKS_DIR, algo.category, `${algo.slug}.md`);
    const content = tryReadFile(taskPath);
    if (!content) continue;

    const parsed = parseTaskFile(content);
    const newStates = parsed.items.map(it => it.checked);

    for (let i = 0; i < parsed.items.length; i++) {
      totalItems++;
      if (parsed.items[i].checked) {
        totalChecked++;
        continue;
      }

      const text = parsed.items[i].text;
      let result;

      if (text.includes('README')) {
        result = analyzeReadme(algo.algoDir);
        if (result.pass) summary.readmePass++;
        else summary.readmeFail++;
      } else if (text.includes('implementation')) {
        // Extract language display name
        const langMatch = text.match(/^(\S+) implementation/);
        if (langMatch) {
          const displayName = langMatch[1];
          const langMap = Object.fromEntries(
            Object.entries(LANGUAGE_DISPLAY).map(([k, v]) => [v, k])
          );
          const lang = langMap[displayName] || displayName.toLowerCase();
          result = analyzeImplementation(algo.algoDir, lang);
          if (result.pass) summary.implPass++;
          else summary.implFail++;
        }
      } else if (text.includes('Animation') || text.includes('animation')) {
        result = analyzeVisualization(algo.category, algo.slug);
        if (result.pass) summary.vizPass++;
        else summary.vizFail++;
      }

      if (result?.pass) {
        newStates[i] = true;
        newlyMarked++;
        totalChecked++;
      }
    }

    // Write updated task file if changes were made
    const changed = newStates.some((s, i) => s !== parsed.items[i].checked);
    if (changed && applyChanges) {
      const updated = updateTaskChecks(content, newStates);
      writeFileSync(taskPath, updated, 'utf-8');
    }
  }

  console.log(`\n─── Analysis Results ────────────────────────────`);
  console.log(`  Total algorithms: ${algorithms.length}`);
  console.log(`  Total checklist items: ${totalItems}`);
  console.log(`  Already checked: ${totalChecked - newlyMarked}`);
  console.log(`  Newly passing: ${newlyMarked}`);
  console.log(`  Total checked after: ${totalChecked} / ${totalItems} (${((totalChecked / totalItems) * 100).toFixed(1)}%)`);
  console.log(`\n  README:          ${summary.readmePass} pass / ${summary.readmeFail} fail`);
  console.log(`  Implementations: ${summary.implPass} pass / ${summary.implFail} fail`);
  console.log(`  Visualizations:  ${summary.vizPass} pass / ${summary.vizFail} fail`);
  console.log(`─────────────────────────────────────────────────`);

  if (!applyChanges) {
    console.log(`\n  Dry run. Use --apply to write changes.`);
  } else {
    console.log(`\n  Changes applied to task files.`);
  }
}

main();

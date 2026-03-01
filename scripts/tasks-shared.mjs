#!/usr/bin/env node

/**
 * tasks-shared.mjs
 *
 * Shared constants and helpers for the task tracking system.
 */

import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parse as parseYaml } from 'yaml';

// ── Path constants ──────────────────────────────────────────────────────────

export const ROOT = resolve(import.meta.dirname, '..');
export const ALGORITHMS_DIR = join(ROOT, 'algorithms');
export const TASKS_DIR = join(ROOT, 'docs', 'tasks');
export const TRACKER_PATH = join(TASKS_DIR, 'TRACKER.md');

// ── Categories (canonical order) ────────────────────────────────────────────

export const CATEGORIES = [
  'backtracking',
  'bit-manipulation',
  'cryptography',
  'data-structures',
  'divide-and-conquer',
  'dynamic-programming',
  'geometry',
  'graph',
  'greedy',
  'math',
  'searching',
  'sorting',
  'strings',
  'trees',
];

// ── Language mappings ───────────────────────────────────────────────────────

export const LANGUAGE_DISPLAY = {
  python:     'Python',
  java:       'Java',
  cpp:        'C++',
  c:          'C',
  go:         'Go',
  typescript: 'TypeScript',
  kotlin:     'Kotlin',
  rust:       'Rust',
  swift:      'Swift',
  scala:      'Scala',
  csharp:     'C#',
};

export const ALL_LANGUAGES = Object.keys(LANGUAGE_DISPLAY);

/** File extensions that indicate real source code (not build artifacts). */
const CODE_EXTENSIONS = new Set([
  '.py', '.java', '.cpp', '.cc', '.cxx', '.h', '.hpp',
  '.c', '.go', '.ts', '.js', '.kt', '.rs', '.swift',
  '.scala', '.cs',
]);

/** Extensions to ignore when detecting implementations. */
const IGNORE_EXTENSIONS = new Set(['.out', '.class', '.o', '.exe']);

// ── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Read + parse a YAML file. Returns null on any failure.
 */
export function tryParseYaml(path) {
  try {
    const text = readFileSync(path, 'utf-8');
    return parseYaml(text);
  } catch {
    return null;
  }
}

/**
 * Read a file as text. Returns null on any failure.
 */
export function tryReadFile(path) {
  try {
    return readFileSync(path, 'utf-8');
  } catch {
    return null;
  }
}

/**
 * List directory names inside `dir` (excludes dot-prefixed and .gitkeep).
 */
export function listDirs(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter(e => e.isDirectory() && !e.name.startsWith('.'))
    .map(e => e.name);
}

/**
 * List file names inside `dir` (excludes dot-prefixed and .gitkeep).
 */
export function listFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter(e => e.isFile() && !e.name.startsWith('.') && e.name !== '.gitkeep')
    .map(e => e.name);
}

/**
 * Scan an algorithm directory for language subdirectories that contain real code files.
 * Returns an array of language names (e.g. ['python', 'java', 'cpp']).
 */
export function detectImplementations(algoDir) {
  const langs = [];
  for (const lang of ALL_LANGUAGES) {
    const langDir = join(algoDir, lang);
    if (!existsSync(langDir)) continue;
    const files = listFiles(langDir);
    const hasCode = files.some(f => {
      const ext = f.substring(f.lastIndexOf('.'));
      return CODE_EXTENSIONS.has(ext) && !IGNORE_EXTENSIONS.has(ext);
    });
    if (hasCode) langs.push(lang);
  }
  return langs;
}

/**
 * Parse a task markdown file. Returns:
 *   { name, slug, category, items: [{ text, checked }] }
 */
export function parseTaskFile(content) {
  // Extract metadata comment: <!-- slug: ... | category: ... -->
  const metaMatch = content.match(/<!--\s*slug:\s*(\S+)\s*\|\s*category:\s*(\S+)\s*-->/);
  const slug = metaMatch ? metaMatch[1] : null;
  const category = metaMatch ? metaMatch[2] : null;

  // Extract name from first heading
  const nameMatch = content.match(/^#\s+(.+)$/m);
  const name = nameMatch ? nameMatch[1].trim() : null;

  // Extract checklist items
  const items = [];
  const lines = content.split('\n');
  for (const line of lines) {
    const checkMatch = line.match(/^- \[([ xX])\] (.+)$/);
    if (checkMatch) {
      items.push({
        text: checkMatch[2].trim(),
        checked: checkMatch[1] !== ' ',
      });
    }
  }

  return { name, slug, category, items };
}

/**
 * Rewrite checkbox states in task file content.
 * `checkedStates` is an array of booleans, one per checkbox in order.
 */
export function updateTaskChecks(content, checkedStates) {
  let idx = 0;
  return content.replace(/^- \[[ xX]\] /gm, (match) => {
    if (idx < checkedStates.length) {
      const checked = checkedStates[idx++];
      return `- [${checked ? 'x' : ' '}] `;
    }
    return match;
  });
}

/**
 * Iterate all algorithms across all categories.
 * Yields { name, slug, category, algoDir, implementations, hasVisualizationMeta }
 */
export function walkAllAlgorithms() {
  const results = [];

  for (const category of CATEGORIES) {
    const categoryDir = join(ALGORITHMS_DIR, category);
    const algos = listDirs(categoryDir).sort();

    for (const slug of algos) {
      const algoDir = join(categoryDir, slug);
      const meta = tryParseYaml(join(algoDir, 'metadata.yaml'));
      const name = meta?.name || slug;
      const implementations = detectImplementations(algoDir);
      const hasVisualizationMeta = meta?.visualization === true;

      results.push({
        name,
        slug,
        category,
        difficulty: meta?.difficulty || 'intermediate',
        algoDir,
        implementations,
        hasVisualizationMeta,
      });
    }
  }

  return results;
}

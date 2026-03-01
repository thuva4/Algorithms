#!/usr/bin/env node

/**
 * build-data.mjs
 *
 * Reads all algorithms metadata, README content, and source code,
 * then outputs static JSON files for the web app to consume.
 *
 * Output:
 *   web/public/data/algorithms-index.json — list of all algorithms with metadata
 *   web/public/data/algorithms/{category}/{slug}.json — per-algorithm detail
 */

import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, resolve, extname } from 'node:path';
import YAML from 'yaml';

const ROOT = resolve(import.meta.dirname, '..');
const ALGORITHMS_DIR = join(ROOT, 'algorithms');
const OUTPUT_DIR = join(ROOT, 'web', 'public', 'data');

const LANGUAGE_EXTENSIONS = {
  python: ['.py'],
  java: ['.java'],
  cpp: ['.cpp', '.cc', '.cxx', '.h', '.hpp'],
  c: ['.c', '.h'],
  go: ['.go'],
  typescript: ['.ts', '.js'],
  kotlin: ['.kt'],
  rust: ['.rs'],
  swift: ['.swift'],
  scala: ['.scala'],
  csharp: ['.cs'],
};

const LANGUAGE_DISPLAY = {
  python: 'Python',
  java: 'Java',
  cpp: 'C++',
  c: 'C',
  go: 'Go',
  typescript: 'TypeScript',
  kotlin: 'Kotlin',
  rust: 'Rust',
  swift: 'Swift',
  scala: 'Scala',
  csharp: 'C#',
};

const CATEGORIES = [
  'sorting', 'searching', 'graph', 'dynamic-programming', 'trees',
  'strings', 'math', 'greedy', 'backtracking', 'divide-and-conquer',
  'bit-manipulation', 'geometry', 'cryptography', 'data-structures',
];

async function tryReadFile(path) {
  try {
    return await readFile(path, 'utf-8');
  } catch {
    return null;
  }
}

async function tryParseYaml(path) {
  const raw = await tryReadFile(path);
  if (!raw) return null;
  try {
    return YAML.parse(raw);
  } catch {
    return null;
  }
}

async function listDirs(dir) {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    return entries.filter(e => e.isDirectory() && !e.name.startsWith('.')).map(e => e.name);
  } catch {
    return [];
  }
}

async function listFiles(dir) {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    return entries.filter(e => e.isFile() && !e.name.startsWith('.')).map(e => e.name);
  } catch {
    return [];
  }
}

async function readCodeFiles(algoDir, langDir) {
  const dir = join(algoDir, langDir);
  const files = await listFiles(dir);
  const validExts = LANGUAGE_EXTENSIONS[langDir] || [];
  const codeFiles = [];

  for (const file of files) {
    if (validExts.some(ext => file.endsWith(ext))) {
      const content = await tryReadFile(join(dir, file));
      if (content) {
        codeFiles.push({ filename: file, content });
      }
    }
  }

  return codeFiles;
}

async function main() {
  const index = [];
  let totalAlgorithms = 0;
  let totalImplementations = 0;

  await mkdir(join(OUTPUT_DIR, 'algorithms'), { recursive: true });

  for (const category of CATEGORIES) {
    const catDir = join(ALGORITHMS_DIR, category);
    const algoSlugs = (await listDirs(catDir)).sort();

    await mkdir(join(OUTPUT_DIR, 'algorithms', category), { recursive: true });

    for (const slug of algoSlugs) {
      const algoDir = join(catDir, slug);
      const meta = await tryParseYaml(join(algoDir, 'metadata.yaml'));
      if (!meta) continue;

      // Read README
      const readme = await tryReadFile(join(algoDir, 'README.md'));

      // Read code for each language
      const implementations = {};
      const subDirs = await listDirs(algoDir);
      for (const sub of subDirs) {
        if (LANGUAGE_DISPLAY[sub]) {
          const files = await readCodeFiles(algoDir, sub);
          if (files.length > 0) {
            implementations[sub] = files;
            totalImplementations += 1;
          }
        }
      }

      const langCount = Object.keys(implementations).length;
      if (langCount === 0) continue;

      totalAlgorithms += 1;

      // Index entry (lightweight)
      index.push({
        name: meta.name,
        slug,
        category,
        difficulty: meta.difficulty || 'intermediate',
        tags: meta.tags || [],
        complexity: meta.complexity || {},
        languageCount: langCount,
        languages: Object.keys(implementations),
        visualization: meta.visualization || false,
      });

      // Detail file (full)
      const detail = {
        ...meta,
        slug,
        category,
        readme: readme || '',
        implementations: Object.fromEntries(
          Object.entries(implementations).map(([lang, files]) => [
            lang,
            { display: LANGUAGE_DISPLAY[lang], files },
          ])
        ),
      };

      await writeFile(
        join(OUTPUT_DIR, 'algorithms', category, `${slug}.json`),
        JSON.stringify(detail, null, 2),
        'utf-8'
      );
    }
  }

  // Write index
  await writeFile(
    join(OUTPUT_DIR, 'algorithms-index.json'),
    JSON.stringify({ totalAlgorithms, totalImplementations, algorithms: index }, null, 2),
    'utf-8'
  );

  console.log(`Data built: ${totalAlgorithms} algorithms, ${totalImplementations} implementations`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

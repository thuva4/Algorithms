#!/usr/bin/env ts-node

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { parsePatternFile } from './lib/pattern-parser';
import { parseAlgorithmMetadata } from './lib/algorithm-parser';
import { renderMarkdown } from './lib/markdown-renderer';
import {
  Pattern,
  PatternsIndex,
  AlgorithmReference,
  ValidationError,
} from './types/pattern';

const PATTERNS_DIR = path.join(process.cwd(), 'patterns');
const ALGORITHMS_DIR = path.join(process.cwd(), 'algorithms');
const OUTPUT_FILE = path.join(process.cwd(), 'web/src/data/patterns-index.json');

async function main() {
  console.log('🔨 Building patterns index...\n');

  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  try {
    // Step 1: Read all pattern files
    console.log('📖 Reading pattern files...');
    const patternFiles = await glob('*.md', { cwd: PATTERNS_DIR, ignore: 'README.md' });
    console.log(`Found ${patternFiles.length} pattern files\n`);

    const patterns: Pattern[] = [];

    for (const file of patternFiles) {
      try {
        const filepath = path.join(PATTERNS_DIR, file);
        const content = fs.readFileSync(filepath, 'utf-8');
        const { frontmatter, content: markdown } = parsePatternFile(file, content);

        const html = renderMarkdown(markdown);

        patterns.push({
          ...frontmatter,
          algorithmCount: 0,
          algorithms: [],
          content: html,
        });

        console.log(`✓ Parsed ${file}`);
      } catch (error) {
        errors.push({ type: 'error', file, message: `${error}` });
        console.error(`✗ Failed to parse ${file}: ${error}`);
      }
    }

    // Step 2: Read all algorithm metadata
    console.log('\n📖 Reading algorithm metadata...');
    const metadataFiles = await glob('**/metadata.yaml', { cwd: ALGORITHMS_DIR });
    console.log(`Found ${metadataFiles.length} algorithm metadata files\n`);

    const patternAlgorithmsMap = new Map<string, AlgorithmReference[]>();

    for (const file of metadataFiles) {
      try {
        const filepath = path.join(ALGORITHMS_DIR, file);
        const content = fs.readFileSync(filepath, 'utf-8');
        const metadata = parseAlgorithmMetadata(file, content);

        if (metadata.patterns && metadata.patterns.length > 0) {
          for (const patternSlug of metadata.patterns) {
            if (!patternAlgorithmsMap.has(patternSlug)) {
              patternAlgorithmsMap.set(patternSlug, []);
            }

            patternAlgorithmsMap.get(patternSlug)!.push({
              slug: metadata.slug,
              name: metadata.name,
              category: metadata.category,
              difficulty: metadata.difficulty || 'intermediate',
              patternDifficulty: metadata.patternDifficulty || 'intermediate',
              complexity: metadata.complexity
                ? {
                    time: metadata.complexity.time?.average,
                    space: metadata.complexity.space,
                  }
                : undefined,
              practiceOrder: metadata.practiceOrder,
            });
          }
        }
      } catch (error) {
        warnings.push({ type: 'warning', file, message: `Failed to parse: ${error}` });
      }
    }

    // Step 3: Associate algorithms with patterns
    console.log('\n🔗 Linking algorithms to patterns...');
    for (const pattern of patterns) {
      const algorithms = patternAlgorithmsMap.get(pattern.slug) || [];

      algorithms.sort((a, b) => {
        const order = { beginner: 0, intermediate: 1, advanced: 2 };
        const diff = order[a.patternDifficulty] - order[b.patternDifficulty];
        if (diff !== 0) return diff;
        return (a.practiceOrder || 999) - (b.practiceOrder || 999);
      });

      pattern.algorithms = algorithms;
      pattern.algorithmCount = algorithms.length;
      console.log(`  ${pattern.slug}: ${algorithms.length} algorithms`);
    }

    // Step 4: Validate
    console.log('\n🔍 Validating...');
    for (const pattern of patterns) {
      if (pattern.algorithmCount < 2) {
        warnings.push({
          type: 'warning',
          file: `${pattern.slug}.md`,
          message: `Pattern has only ${pattern.algorithmCount} algorithm(s). Recommend at least 2.`,
        });
      }
    }

    for (const pattern of patterns) {
      for (const relatedSlug of pattern.relatedPatterns) {
        if (!patterns.find((p) => p.slug === relatedSlug)) {
          errors.push({
            type: 'error',
            file: `${pattern.slug}.md`,
            message: `Related pattern "${relatedSlug}" does not exist`,
          });
        }
      }
    }

    // Step 5: Write output
    const output: PatternsIndex = {
      patterns,
      lastUpdated: new Date().toISOString(),
    };

    const outputDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));

    console.log(`\n✅ Patterns index written to ${OUTPUT_FILE}`);
    console.log(`   ${patterns.length} patterns, ${metadataFiles.length} algorithms processed\n`);

    if (warnings.length > 0) {
      console.log(`⚠️  ${warnings.length} warning(s):`);
      for (const warning of warnings) {
        console.log(`   ${warning.file}: ${warning.message}`);
      }
    }

    if (errors.length > 0) {
      console.error(`❌ ${errors.length} error(s):`);
      for (const error of errors) {
        console.error(`   ${error.file}: ${error.message}`);
      }
      process.exit(1);
    }

    console.log('✨ Done!');
  } catch (error) {
    console.error('\n❌ Build failed:', error);
    process.exit(1);
  }
}

main();

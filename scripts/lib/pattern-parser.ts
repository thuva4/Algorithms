import matter from 'gray-matter';
import { PatternFrontmatter, ValidationError } from '../types/pattern';

export interface ParsedPattern {
  frontmatter: PatternFrontmatter;
  content: string;
}

const REQUIRED_FIELDS = [
  'name',
  'slug',
  'category',
  'difficulty',
  'timeComplexity',
  'spaceComplexity',
  'recognitionTips',
  'commonVariations',
  'relatedPatterns',
  'keywords',
  'estimatedTime',
];

export function parsePatternFile(
  filename: string,
  content: string
): ParsedPattern {
  const { data, content: markdownContent } = matter(content);

  // Validate required fields
  const errors: ValidationError[] = [];
  for (const field of REQUIRED_FIELDS) {
    if (!(field in data)) {
      errors.push({
        type: 'error',
        file: filename,
        message: `Missing required field: ${field}`,
      });
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `Validation failed for ${filename}:\n${errors
        .map((e) => `  - ${e.message}`)
        .join('\n')}`
    );
  }

  // Validate difficulty enum
  if (!['beginner', 'intermediate', 'advanced'].includes(data.difficulty)) {
    throw new Error(
      `Invalid difficulty "${data.difficulty}" in ${filename}. Must be: beginner, intermediate, or advanced`
    );
  }

  // Validate arrays
  if (!Array.isArray(data.recognitionTips) || data.recognitionTips.length < 2) {
    throw new Error(
      `recognitionTips must be an array with at least 2 items in ${filename}`
    );
  }

  if (!Array.isArray(data.commonVariations)) {
    throw new Error(
      `commonVariations must be an array in ${filename}`
    );
  }

  if (!Array.isArray(data.relatedPatterns)) {
    throw new Error(
      `relatedPatterns must be an array in ${filename}`
    );
  }

  if (!Array.isArray(data.keywords)) {
    throw new Error(
      `keywords must be an array in ${filename}`
    );
  }

  return {
    frontmatter: data as PatternFrontmatter,
    content: markdownContent,
  };
}

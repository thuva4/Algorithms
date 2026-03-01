import { describe, it, expect } from 'vitest';
import { parseAlgorithmMetadata } from '../algorithm-parser';

describe('Algorithm Parser', () => {
  it('should parse algorithm metadata with patterns', () => {
    const yaml = `
name: Binary Search
slug: binary-search
category: searching
patterns:
  - modified-binary-search
patternDifficulty: beginner
`;

    const result = parseAlgorithmMetadata('binary-search/metadata.yaml', yaml);
    expect(result.slug).toBe('binary-search');
    expect(result.patterns).toContain('modified-binary-search');
    expect(result.patternDifficulty).toBe('beginner');
  });

  it('should handle algorithms without patterns', () => {
    const yaml = `
name: Binary Search
slug: binary-search
category: searching
`;

    const result = parseAlgorithmMetadata('binary-search/metadata.yaml', yaml);
    expect(result.patterns).toEqual([]);
  });

  it('should throw error for invalid YAML syntax', () => {
    const invalidYaml = `
name: Binary Search
slug: binary-search
  category: searching
    invalid indentation
`;

    expect(() => {
      parseAlgorithmMetadata('binary-search/metadata.yaml', invalidYaml);
    }).toThrow(/Failed to parse/);
  });

  it('should throw error for missing required fields', () => {
    const missingFieldYaml = `
patterns:
  - some-pattern
`;

    expect(() => {
      parseAlgorithmMetadata('binary-search/metadata.yaml', missingFieldYaml);
    }).toThrow(/Failed to parse/);
  });
});

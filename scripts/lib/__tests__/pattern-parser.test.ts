import { describe, it, expect } from 'vitest';
import { parsePatternFile } from '../pattern-parser';

describe('Pattern Parser', () => {
  it('should parse valid pattern frontmatter', () => {
    const markdown = `---
name: Sliding Window
slug: sliding-window
category: array
difficulty: beginner
timeComplexity: O(n)
spaceComplexity: O(1)
recognitionTips:
  - "Problem involves contiguous subarrays"
  - "Maintain window state"
commonVariations:
  - "Fixed-size window"
relatedPatterns: []
keywords: [array]
estimatedTime: 2-3 hours
---

# Content
`;

    const result = parsePatternFile('sliding-window.md', markdown);
    expect(result.frontmatter.slug).toBe('sliding-window');
    expect(result.frontmatter.difficulty).toBe('beginner');
    expect(result.content).toContain('# Content');
  });

  it('should throw on missing required field', () => {
    const markdown = `---
name: Test
slug: test
---
# Content
`;

    expect(() => parsePatternFile('test.md', markdown))
      .toThrow(/Missing required field/);
  });

  it('should throw on invalid difficulty value', () => {
    const markdown = `---
name: Test Pattern
slug: test-pattern
category: array
difficulty: expert
timeComplexity: O(n)
spaceComplexity: O(1)
recognitionTips:
  - "Tip one"
  - "Tip two"
commonVariations: []
relatedPatterns: []
keywords: []
estimatedTime: 1 hour
---
# Content
`;

    expect(() => parsePatternFile('test.md', markdown))
      .toThrow(/Invalid difficulty/);
  });

  it('should throw when recognitionTips has fewer than 2 items', () => {
    const markdown = `---
name: Test Pattern
slug: test-pattern
category: array
difficulty: beginner
timeComplexity: O(n)
spaceComplexity: O(1)
recognitionTips:
  - "Only one tip"
commonVariations: []
relatedPatterns: []
keywords: []
estimatedTime: 1 hour
---
# Content
`;

    expect(() => parsePatternFile('test.md', markdown))
      .toThrow(/recognitionTips must be an array with at least 2 items/);
  });

  it('should throw when array fields are not arrays', () => {
    const markdown = `---
name: Test Pattern
slug: test-pattern
category: array
difficulty: beginner
timeComplexity: O(n)
spaceComplexity: O(1)
recognitionTips:
  - "Tip one"
  - "Tip two"
commonVariations: "not an array"
relatedPatterns: []
keywords: []
estimatedTime: 1 hour
---
# Content
`;

    expect(() => parsePatternFile('test.md', markdown))
      .toThrow(/commonVariations must be an array/);
  });
});

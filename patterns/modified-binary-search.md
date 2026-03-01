---
name: Modified Binary Search
slug: modified-binary-search
category: searching
difficulty: intermediate
timeComplexity: O(log n)
spaceComplexity: O(1)
recognitionTips:
  - "Problem involves searching in a sorted or partially sorted array"
  - "Need to find an element that satisfies certain properties in logarithmic time"
  - "Array has some rotational or conditional ordering"
commonVariations:
  - "Search in rotated sorted array"
  - "Find peak element"
  - "Search in 2D matrix"
relatedPatterns: []
keywords: [binary-search, sorted, logarithmic]
estimatedTime: 3-4 hours
---

# Modified Binary Search Pattern

## Overview

Modified Binary Search extends classic binary search to handle complex scenarios. The key insight is that binary search works whenever you can eliminate half the search space based on a condition.

## When to Use This Pattern

- Sorted or partially sorted array
- Need O(log n) time
- Can determine which half to eliminate
- Finding boundaries, peaks, or special elements

## Core Technique

1. Define left and right boundaries
2. Calculate midpoint
3. Make decision based on mid element
4. Eliminate half search space
5. Repeat until found

### Pseudocode

```
function search(array, target):
    left = 0, right = len - 1
    while left <= right:
        mid = left + (right - left) / 2
        if found: return mid
        elif go_left: right = mid - 1
        else: left = mid + 1
    return -1
```

## Example Walkthrough

Binary search on sorted array [1, 3, 5, 7, 9], target = 5:
- mid = 2 (value 5) → found!

## Common Pitfalls

Problem: Integer overflow with (left + right) / 2
Solution: Use left + (right - left) / 2

Problem: Infinite loops from wrong boundary updates
Solution: Ensure left/right always converge

## Interview Tips

1. Check for ordered property (not just sorted)
2. Handle empty array, single element edge cases
3. Be careful with `<=` vs `<` in while condition
4. Test with even and odd length arrays

## Practice Progression

Algorithms below are auto-populated from repository.

## Related Patterns

No closely related patterns yet.

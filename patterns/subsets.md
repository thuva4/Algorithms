---
name: Subsets
slug: subsets
category: backtracking
difficulty: intermediate
timeComplexity: O(2^n)
spaceComplexity: O(2^n)
recognitionTips:
  - "Problem asks to find all possible combinations or subsets"
  - "Need to generate all permutations of a set"
  - "Problem involves exploring all possible states (combinatorial)"
  - "Need to find all valid groupings or partitions"
commonVariations:
  - "All subsets (power set)"
  - "Subsets with duplicates"
  - "All permutations"
  - "Combinations of size K"
relatedPatterns: []
keywords: [subsets, combinations, permutations, backtracking, power-set]
estimatedTime: 3-4 hours
---

# Subsets Pattern

## Overview

The Subsets pattern is a systematic approach for generating every possible selection from a set of elements — the full power set. For a set of n elements, there are exactly 2^n subsets (including the empty set and the full set itself), because each element independently has two choices: it is either included or excluded.

There are two standard ways to build the power set. The **BFS (iterative) approach** treats subset generation as level-by-level expansion: start with the empty set, then for each new element, take every existing subset and create a new subset by adding the element to it. This doubles the result list at each step and is easy to implement iteratively. The **DFS (backtracking) approach** explores a decision tree: at each element, recurse into two branches — include it, or skip it — and record the current path as a subset at any point (or only at leaf nodes, depending on the variation). Both approaches produce all 2^n subsets.

The pattern generalizes to combinations of size K (only record at depth K), permutations (all elements must be used, order matters), and constrained subsets (only record when the subset meets a target sum, for example). Recognizing the pattern and choosing the right variant before coding is the key skill tested in interviews.

## When to Use

Recognize this pattern when you see:

- The problem asks for "all possible" subsets, combinations, or groupings — not just one optimal answer
- You need to generate the power set of an input array or string
- The problem requires exploring every valid configuration: partitions, groupings, assignments
- You need all permutations of a sequence (a related but distinct variant)
- A constraint is placed on which subsets are valid, but you still need to enumerate all candidates (e.g., subsets that sum to a target)
- The input size is small (typically n ≤ 20), consistent with exponential output
- Keywords in the problem: "all subsets", "all combinations", "power set", "all arrangements", "enumerate", "generate"

## Core Technique

### BFS (Iterative / Level-by-Level) Approach

Start with a result list containing only the empty subset. For each element in the input, iterate over every subset currently in the result list and create a new subset by appending the current element. Add all new subsets to the result list. After processing all n elements, the result list contains all 2^n subsets.

This approach is intuitive because each element doubles the number of subsets, and you can observe the expansion one element at a time.

### DFS (Backtracking / Recursive) Approach

Recursively build subsets by making a binary choice at each element: include it or exclude it. Maintain a current path and a start index. At each recursive call, record the current path as a valid subset, then try adding each remaining element (from `start` onward) to extend the current path, backtrack, and try the next.

### Pseudocode

**BFS approach:**

```
function subsetsIterative(nums):
    result = [[]]  # start with the empty subset

    for num in nums:
        newSubsets = []
        for existingSubset in result:
            newSubsets.append(existingSubset + [num])
        result = result + newSubsets

    return result
```

**DFS / backtracking approach:**

```
function subsetsBacktracking(nums):
    result = []
    backtrack(nums, start=0, current=[], result)
    return result

function backtrack(nums, start, current, result):
    result.append(copy of current)  # every prefix is a valid subset

    for i from start to len(nums) - 1:
        current.append(nums[i])          # choose: include nums[i]
        backtrack(nums, i + 1, current, result)
        current.pop()                    # un-choose: backtrack
```

For the **duplicates variant**, sort the input first and skip an element in the loop if it equals the previous element and the previous element was not chosen at this level (i.e., `i > start and nums[i] == nums[i-1]`).

For the **combinations of size K variant**, only append `current` to result when `len(current) == K`, and prune when `len(current) + remaining elements < K`.

## Example Walkthrough

### Problem

Generate all subsets of `[1, 2, 3]`.

**Expected Output** (order may vary):
`[[], [1], [2], [3], [1,2], [1,3], [2,3], [1,2,3]]`

### BFS Expansion — Step by Step

Start with the empty set and process each element one at a time, doubling the result list at each step.

**Initial state:**

```
result = [ [] ]
```

**Process element `1`:**

For each existing subset in result, create a new subset with `1` added:
- `[]` + `[1]` → `[1]`

Append the new subsets. Result is now:

```
result = [ [], [1] ]
```

Expansion visual:

```
Level 0:  []
           |
Level 1:  []   [1]
```

**Process element `2`:**

For each existing subset in result, create a new subset with `2` added:
- `[]` + `[2]`  → `[2]`
- `[1]` + `[2]` → `[1, 2]`

Append the new subsets. Result is now:

```
result = [ [], [1], [2], [1,2] ]
```

Expansion visual:

```
Level 1:  []         [1]
           |           |
Level 2:  []  [2]   [1]  [1,2]
```

**Process element `3`:**

For each existing subset in result, create a new subset with `3` added:
- `[]`    + `[3]` → `[3]`
- `[1]`   + `[3]` → `[1, 3]`
- `[2]`   + `[3]` → `[2, 3]`
- `[1,2]` + `[3]` → `[1, 2, 3]`

Append the new subsets. Result is now:

```
result = [ [], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3] ]
```

Full expansion visual:

```
Level 0:       []
              /    \
Level 1:    []      [1]
           / \      / \
Level 2: []  [2] [1] [1,2]
         |    |   |     |
Level 3: [] [2,3][1,3] ... (each gets +3 variant)

All 8 subsets collected:
  []  [1]  [2]  [1,2]  [3]  [1,3]  [2,3]  [1,2,3]
```

**Summary table:**

```
After processing | Subsets added                      | Total count
-----------------|------------------------------------|------------
(initial)        | []                                 | 1
element 1        | [1]                                | 2
element 2        | [2], [1,2]                         | 4
element 3        | [3], [1,3], [2,3], [1,2,3]         | 8
```

Each element doubles the count: 1 → 2 → 4 → 8. For n elements, the result is always 2^n subsets.

## Common Pitfalls

1. **Storing a reference instead of a copy of the current subset.**

   In the backtracking approach, `result.append(current)` appends a reference to the mutable list `current`. As backtracking continues and `current` changes, every entry in `result` that points to `current` reflects those changes. You end up with a result full of identical (and usually empty) lists. Always append `current[:]` or `list(current)` — a shallow copy — not the list object itself.

2. **Not handling duplicates in the input.**

   If the input contains duplicate elements (e.g., `[1, 2, 2]`) and the problem asks for unique subsets, the naive approach produces duplicate subsets like `[1,2]` twice. The fix is to sort the array first, then skip an element in the loop if `i > start and nums[i] == nums[i-1]`. Skipping must be conditioned on `i > start` (not just `i > 0`) to avoid incorrectly skipping elements that were excluded at a parent level.

3. **Confusing subsets with combinations of size K.**

   In the full subsets problem, every prefix of every decision path is a valid subset — so you record `current` at the start of each recursive call. In the combinations-of-size-K problem, you only record when `len(current) == K`. Using the wrong recording condition produces either too many or too few results. Clarify this before coding.

4. **Generating permutations with subset logic.**

   Subset and combination logic uses a `start` index to avoid reusing or reordering earlier elements. Permutation logic has no `start` index — it uses a `visited` array (or swapping) to allow every remaining element at each position. Mixing these approaches produces neither correct subsets nor correct permutations.

5. **Assuming the result fits in memory for large n.**

   Interviewers sometimes ask about n = 30 or n = 40 as a follow-up. At n = 30, the power set has over one billion entries. For such cases, you cannot enumerate all subsets — you need a different approach (e.g., meet-in-the-middle, bitmask DP, or a lazy generator). Mention this limitation proactively if n seems large.

## Interview Tips

1. **Clarify whether the input can have duplicates.** This is the single most important question to ask before coding the subsets problem. Duplicates require the sort-and-skip logic. Starting the clean version and then pivoting to add duplicate handling mid-implementation looks unplanned. Ask upfront.

2. **Know both approaches and when to use each.** The BFS iterative approach is easier to explain at a high level ("each element doubles the list") and easier to implement without recursion-related bugs. The backtracking approach generalizes more naturally to constrained variants (combinations of size K, subsets summing to a target). Knowing both gives you flexibility depending on what the interviewer follows up with.

3. **Draw the decision tree for backtracking problems.** At each node, label the two branches: "include" and "exclude". Drawing even a partial tree for n = 3 communicates the algorithm structure clearly, makes the recursion obvious, and shows you know the combinatorial depth (O(2^n) leaves).

4. **State the time and space complexity in terms of the output.** The result contains 2^n subsets, each of average length n/2, so the total output size is O(n * 2^n). Both time and space are O(n * 2^n). Saying just "O(2^n)" slightly undersells the actual cost; the interviewer will appreciate the precise bound.

5. **Use the bitmask interpretation as an alternative explanation.** For n ≤ 20, you can generate all subsets by iterating integers from 0 to 2^n - 1 and interpreting each bit as an include/exclude decision for the corresponding element. This is elegant and sometimes faster to code. Mention it as an alternative even if you implement backtracking.

## Practice Progression

This section is auto-populated from algorithms in this repository that are tagged with the `subsets` pattern. As more algorithms are added and linked, they will appear here organized by difficulty.

For external practice, problems are typically ordered: all subsets of a set with distinct elements (core) before all unique subsets with duplicates (requires sort-and-skip), before all permutations (requires visited array or swap logic), before all combinations summing to a target (backtracking with pruning), before partition problems (advanced constrained enumeration).

## Related Patterns

No related patterns are linked yet. As additional patterns are added to this repository, the following connections will be documented:

- **Backtracking** — The subsets pattern is one of the three canonical backtracking problems alongside permutations and combinations. Understanding subsets first provides the clearest introduction to the explore-record-backtrack structure that all backtracking problems share.
- **Dynamic Programming (Bitmask DP)** — For small n, the set of all subsets corresponds directly to all bitmasks from 0 to 2^n - 1. Bitmask DP uses this representation to compute optimal values over subsets, and understanding the power-set structure makes bitmask DP feel natural.

---
name: Tree Depth-First Search
slug: tree-dfs
category: tree
difficulty: intermediate
timeComplexity: O(n)
spaceComplexity: O(h)
recognitionTips:
  - "Problem requires exploring all paths from root to leaf"
  - "Need to find a path with a specific sum"
  - "Problem involves in-order, pre-order, or post-order traversal"
  - "Need to compute properties that depend on subtree results"
  - "Problem involves backtracking through a tree"
commonVariations:
  - "Pre-order (node → left → right)"
  - "In-order (left → node → right)"
  - "Post-order (left → right → node)"
  - "Path sum problems (root to leaf)"
relatedPatterns: []
keywords: [tree, dfs, recursion, backtracking, path, depth-first]
estimatedTime: 3-4 hours
---

# Tree Depth-First Search Pattern

## Overview

The Tree Depth-First Search (DFS) pattern explores a tree by going as deep as possible along each branch before backtracking. Starting at the root, you follow one child all the way to a leaf, then return to the nearest ancestor that has an unexplored child, and repeat. The mechanism is the call stack in recursive implementations, or an explicit stack in iterative ones.

Three orderings define when you process the current node relative to its children:

- **Pre-order** (node → left → right): Process the current node before descending. Useful when the parent's value must be known before processing children — copying a tree, serializing a tree, or recording a root-to-leaf path.
- **In-order** (left → node → right): Process the current node between its subtrees. For a binary search tree, in-order traversal visits nodes in ascending sorted order.
- **Post-order** (left → right → node): Process the current node after both subtrees have returned. Useful when a node's result depends on its children's results — computing subtree heights, diameter, or any bottom-up aggregation.

Space complexity is O(h) where h is the tree height, because the call stack holds at most one frame per level of the current path. For a balanced tree, h = O(log n); for a degenerate (linked-list) tree, h = O(n). This is more space-efficient than BFS for deep, narrow trees and less space-efficient for wide, shallow ones.

The pattern's power in interview problems comes from the recursive structure of trees themselves: any problem on a tree can usually be decomposed into the same problem on the left subtree and the right subtree, combined with some logic at the current node. Once you identify where in the order (pre/in/post) that combination logic belongs, the code follows directly.

## When to Use This Pattern

Reach for Tree DFS when you see any of these signals:

- The problem requires **exploring all root-to-leaf paths** — path sum, all paths with a given sum, longest path, or collecting all paths as strings.
- You need to **compute a property that depends on subtree results** — the height of a tree, the diameter, whether the tree is balanced, the maximum path sum. These are inherently post-order problems because you cannot know a node's result until both children have reported their results.
- The problem involves a specific **traversal order** by name: in-order, pre-order, or post-order.
- You are working with a **binary search tree** and need to exploit sorted order — in-order traversal visits BST nodes in ascending order, enabling in-place sorted operations.
- The problem asks you to **reconstruct or serialize** a tree. Pre-order traversal preserves the root-first structure needed for reconstruction.
- The problem involves **backtracking through a tree** — building a path as you recurse down, then undoing the addition when you return up. Path collection problems follow this pattern exactly.
- Keywords: "path sum", "root to leaf", "all paths", "height", "depth", "diameter", "lowest common ancestor", "validate BST", "serialize".

## Core Technique

The recursive DFS template follows directly from the definition of traversal order. The only things that change between problems are: what you do at the node, and what you pass down or return up.

**Two directions of information flow:**

- **Top-down (pass state as parameters):** Carry accumulated information from the root toward the leaves. Each recursive call receives the current path sum, depth, or running value. Use this when the problem computes something at leaves or along edges.
- **Bottom-up (return state from recursion):** Compute results at leaves and aggregate them on the way back up. Each recursive call returns a value (height, max sum, count) that the parent combines. Use this for subtree-dependent properties.

Many problems combine both: pass something down and return something up.

### Pseudocode

**Pre-order DFS (process node before children):**

```
function preOrder(node, accumulated):
    if node is null:
        return

    process(node, accumulated)          # act on current node first

    preOrder(node.left,  updated(accumulated, node))
    preOrder(node.right, updated(accumulated, node))
```

**In-order DFS (process node between children — BST sorted order):**

```
function inOrder(node):
    if node is null:
        return

    inOrder(node.left)
    process(node)                       # act on current node in the middle
    inOrder(node.right)
```

**Post-order DFS (process node after children — bottom-up aggregation):**

```
function postOrder(node):
    if node is null:
        return baseValue              # e.g., 0 for height, null for leaves

    leftResult  = postOrder(node.left)
    rightResult = postOrder(node.right)

    return combine(leftResult, rightResult, node)   # act after both children
```

**Path sum (top-down, short-circuit at leaves):**

```
function hasPathSum(node, remainingSum):
    if node is null:
        return false

    remainingSum -= node.value

    # Leaf check: only count paths that end at a leaf
    if node.left is null and node.right is null:
        return remainingSum == 0

    return hasPathSum(node.left,  remainingSum) or
           hasPathSum(node.right, remainingSum)
```

**Collect all root-to-leaf paths (top-down with backtracking):**

```
function allPaths(node, currentPath, result):
    if node is null:
        return

    currentPath.append(node.value)     # choose

    if node.left is null and node.right is null:
        result.append(copy of currentPath)
    else:
        allPaths(node.left,  currentPath, result)
        allPaths(node.right, currentPath, result)

    currentPath.pop()                  # un-choose (backtrack)
```

## Example Walkthrough

### Problem

Given the binary tree below, determine if there exists a root-to-leaf path whose node values sum to 22.

```
          5
         / \
        4   8
       /   / \
      11  13  4
     /  \      \
    7    2      1
```

**Input:** root = 5, targetSum = 22
**Output:** `true` — the path `5 → 4 → 11 → 2` sums to 22.

### Step-by-Step Trace

The algorithm uses top-down DFS, passing `remainingSum = targetSum - node.value` at each step. When we reach a leaf and `remainingSum == 0`, we found our path.

---

**Call 1: node = 5, remaining = 22**

```
          [5]  remaining = 22 - 5 = 17
         /   \
        4     8
```

Not a leaf. Recurse left with remaining = 17.

---

**Call 2: node = 4, remaining = 17**

```
        [4]  remaining = 17 - 4 = 13
        /
      11
```

Not a leaf. Recurse left with remaining = 13.

---

**Call 3: node = 11, remaining = 13**

```
        [11]  remaining = 13 - 11 = 2
        /  \
       7    2
```

Not a leaf. Recurse left (node 7) with remaining = 2.

---

**Call 4: node = 7, remaining = 2**

```
        [7]  remaining = 2 - 7 = -5
```

Node 7 is a leaf. Is remaining == 0? -5 != 0. **Return false.**

---

**Back at Call 3: node = 11.** Left returned false. Recurse right (node 2) with remaining = 2.

---

**Call 5: node = 2, remaining = 2**

```
        [2]  remaining = 2 - 2 = 0
```

Node 2 is a leaf. Is remaining == 0? Yes! **Return true.**

---

**Propagation:** true bubbles up through call 3 (node 11) → call 2 (node 4) → call 1 (node 5). The function returns true without ever exploring the right subtree rooted at 8, because the `or` short-circuits.

**Full path traced:**

```
          5          ← visited (remaining: 22→17)
         /
        4            ← visited (remaining: 17→13)
       /
      11             ← visited (remaining: 13→2)
     /  \
    7    2           ← 7 tried and failed; 2 succeeded (remaining: 2→0)
         ^
         PATH FOUND: 5 + 4 + 11 + 2 = 22
```

**Call stack at deepest point (Call 5):**

```
hasPathSum(2,  remaining=2)      ← innermost
hasPathSum(11, remaining=2)
hasPathSum(4,  remaining=13)
hasPathSum(5,  remaining=17)     ← outermost (just below main)
```

Stack depth = tree height = 4 frames. Space complexity is O(h).

## Common Pitfalls

1. **Missing or incorrect base cases**

   Every recursive DFS function must handle the null node case. Forgetting it causes null pointer exceptions the moment the algorithm reaches a leaf and tries to recurse on its (null) children. A subtler mistake is handling null correctly but failing to handle the leaf case for path problems — allowing a path to "end" at a non-leaf internal node with no children explored, yielding phantom matches.

   Fix: Always write the null check first. For path-sum problems, add a separate leaf check (`node.left is null and node.right is null`) before returning a result.

2. **Stack overflow on degenerate trees**

   For a balanced tree with n nodes, the recursion depth is O(log n). For a degenerate tree (every node has only one child, forming a linked list), depth is O(n). With n = 100,000 nodes, a naive recursive DFS will overflow the call stack in most languages.

   Fix: For production code, prefer an iterative DFS using an explicit stack. For interviews, mention this limitation when asked about edge cases or scalability, and offer the iterative approach as a follow-up.

3. **Mutating shared state without backtracking**

   When collecting all paths, you typically build a `currentPath` list and append/pop as you recurse. A common bug is appending to the list but forgetting to pop when returning, so the path grows incorrectly on sibling branches. A related bug is appending `currentPath` to the results without copying it — the result list ends up holding multiple references to the same list object, which gets mutated as the traversal continues.

   Fix: Always `pop` after recursing (backtrack). Always `copy` the current path before adding it to results: `result.append(list(currentPath))` or equivalent.

4. **Confusing traversal orders and applying the wrong one**

   Applying pre-order logic when post-order is needed (or vice versa) is a subtle bug. For example, computing tree height with pre-order logic (combining parent height with children) fails because you haven't received the children's heights yet.

   Fix: Ask yourself: "Does the current node's result depend on its children's results?" If yes, use post-order. If the current node's value must be passed down to influence children, use pre-order. For BST sorted-order processing, use in-order.

5. **Incorrect leaf detection in trees with single-child nodes**

   In trees where nodes can have zero, one, or two children, checking only `node.left is null` to detect a leaf is wrong — a node with only a right child would be incorrectly treated as a leaf. This is especially common in path-sum problems where it leads to counting partial paths as complete ones.

   Fix: A leaf is a node where both `node.left is null` AND `node.right is null`. Always use the conjunction, never the disjunction.

## Interview Tips

1. **Identify the traversal order before writing any code.** State aloud: "I need each node's result before I process its children, so I'll use pre-order" or "I need the children's results first, so I'll use post-order." Naming the order demonstrates that you understand the structure of the problem and prevents you from painting yourself into a corner mid-implementation.

2. **Name your recursive function's contract.** Before writing the body, state: "This function returns the height of the subtree rooted at node" or "This function returns true if any root-to-leaf path sums to target." A clear contract makes the base case and recursive step obvious, and it signals rigorous thinking to the interviewer.

3. **Draw the call tree, not just the input tree.** When tracing through your algorithm, sketch the recursive calls as a tree (which call invokes which). This helps you identify the base cases, the return values, and where combinations happen — and it is much easier to follow than narrating a recursive execution verbally.

4. **Mention the two directions of information flow.** Telling the interviewer "I am passing the running sum top-down as a parameter, and returning a boolean bottom-up" shows you have a mental model for how data moves through the recursion — a sign of experience with recursive problem decomposition.

5. **Always state the space complexity in terms of height, not n.** The correct answer is O(h) for the call stack, where h is the height of the tree. Then qualify it: O(log n) for a balanced tree and O(n) for a degenerate (skewed) tree. Giving a single O(n) answer without this distinction is imprecise and misses a real insight about tree structure.

## Practice Progression

This section is auto-populated from algorithms in this repository that are tagged with the `tree-dfs` pattern. As more algorithms are added and linked, they will appear here organized by difficulty.

For external practice, a typical progression is: maximum depth of binary tree (pure post-order template) before path sum (top-down with leaf check) before all root-to-leaf paths (top-down with backtracking) before diameter of binary tree (post-order returning height, updating global maximum) before lowest common ancestor (post-order returning found nodes) before serialize and deserialize binary tree (pre-order with null markers).

## Related Patterns

No related patterns are linked yet. As additional patterns are added to this repository, the following connection will be documented:

- **Tree Breadth-First Search** — BFS is the natural complement to DFS on trees. Where DFS explores each path fully before backtracking using a recursive call stack and O(h) space, BFS processes nodes level by level using a queue and O(n) space, guaranteeing the shallowest result is found first. Problems that ask for the minimum depth, right-side view, or level-by-level aggregates favor BFS; problems that require full path exploration, subtree-dependent computation, or traversal in a specific order favor DFS. Recognizing which dimension of the tree — depth (BFS) or path (DFS) — the problem is really asking about is the core skill for choosing between the two.

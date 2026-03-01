---
name: Tree Breadth-First Search
slug: tree-bfs
category: tree
difficulty: intermediate
timeComplexity: O(n)
spaceComplexity: O(n)
recognitionTips:
  - "Problem asks to process nodes level by level"
  - "Need to find shortest path in an unweighted graph or tree"
  - "Problem involves level order traversal"
  - "Need to find minimum depth or closest node"
  - "Problem asks about nodes at a specific depth"
commonVariations:
  - "Level order traversal (collect nodes per level)"
  - "Zigzag level order (alternate left-right per level)"
  - "Right-side view (last node per level)"
  - "Level averages or sums"
relatedPatterns: []
keywords: [tree, bfs, level-order, queue, breadth-first]
estimatedTime: 3-4 hours
---

# Tree Breadth-First Search Pattern

## Overview

The Tree Breadth-First Search (BFS) pattern processes a tree level by level, visiting every node at depth d before visiting any node at depth d + 1. The mechanism is a queue (FIFO): you enqueue the root, then repeatedly dequeue a node, process it, and enqueue its children. Because children are added to the back of the queue while the current level is being consumed from the front, the traversal naturally respects level boundaries.

The core advantage of BFS over DFS in tree problems is that BFS always finds the shallowest path first. If you need the minimum depth, the closest node to the root matching some condition, or any result that is defined by proximity to the root rather than by exploring entire paths, BFS reaches the answer as soon as it encounters it — without having to examine the whole tree.

Space complexity is O(n) in the worst case because the queue can hold an entire level of nodes. For a balanced binary tree, the widest level (the leaf level) contains roughly n/2 nodes. This is the trade-off versus DFS, which uses O(h) stack space where h is the tree height.

Understanding the level boundary is the single most important concept in this pattern. Capturing level-by-level information (averages, right-side views, zigzag orders) all come down to one technique: recording the queue's size before processing a level, then processing exactly that many nodes before moving to the next level.

## When to Use This Pattern

Reach for Tree BFS when you see any of these signals:

- The problem explicitly asks for **level order traversal** or asks you to return a list of lists, where each inner list represents one level of the tree.
- You need the **minimum depth** or the **shortest path** from the root to a leaf, or from any node to another. BFS guarantees you find it on the first encounter, without exploring deep branches unnecessarily.
- The problem asks about nodes **at a specific depth** — how many are there, what is their sum, what is the maximum value among them.
- You need the **right-side view** or **left-side view** of the tree, meaning the last (or first) node visible at each level when looking from one side.
- The problem involves **level-by-level aggregates**: compute the average, sum, maximum, or minimum value per level.
- You are working with a **multi-source BFS** — finding the minimum distance from any of multiple starting nodes to all other nodes. The same queue-based approach works by seeding the queue with all sources simultaneously.
- Keywords: "level order", "closest", "minimum depth", "width of tree", "right side view", "connect next pointers at same level".

## Core Technique

The algorithm has one invariant: the queue always contains exactly the nodes of the current level at the start of each iteration.

**Single-level processing** is the template for almost every BFS problem:

1. Seed the queue with the root (or multiple roots for multi-source BFS).
2. While the queue is not empty, record its current size — call it `levelSize`. This is the number of nodes at the current level.
3. Loop `levelSize` times: dequeue a node, process it, enqueue its non-null children.
4. After the inner loop finishes, you have consumed one full level. Increment your level counter or record whatever per-level result you need.
5. Repeat from step 2.

### Pseudocode

```
function bfsLevelOrder(root):
    if root is null:
        return []

    queue = new Queue()
    queue.enqueue(root)
    result = []

    while queue is not empty:
        levelSize = queue.size()
        currentLevel = []

        for i from 0 to levelSize - 1:
            node = queue.dequeue()
            currentLevel.append(node.value)

            if node.left is not null:
                queue.enqueue(node.left)
            if node.right is not null:
                queue.enqueue(node.right)

        result.append(currentLevel)

    return result
```

**Zigzag variation** — alternate the direction of insertion per level:

```
function bfsZigzag(root):
    queue = new Queue()
    queue.enqueue(root)
    leftToRight = true
    result = []

    while queue is not empty:
        levelSize = queue.size()
        currentLevel = new Deque()   # double-ended queue

        for i from 0 to levelSize - 1:
            node = queue.dequeue()

            if leftToRight:
                currentLevel.appendRight(node.value)
            else:
                currentLevel.appendLeft(node.value)

            if node.left  is not null: queue.enqueue(node.left)
            if node.right is not null: queue.enqueue(node.right)

        result.append(list(currentLevel))
        leftToRight = not leftToRight

    return result
```

**Minimum depth** — return as soon as you reach a leaf:

```
function minimumDepth(root):
    if root is null: return 0

    queue = new Queue()
    queue.enqueue(root)
    depth = 0

    while queue is not empty:
        depth += 1
        levelSize = queue.size()

        for i from 0 to levelSize - 1:
            node = queue.dequeue()

            # First leaf encountered is at the minimum depth
            if node.left is null and node.right is null:
                return depth

            if node.left  is not null: queue.enqueue(node.left)
            if node.right is not null: queue.enqueue(node.right)

    return depth
```

## Example Walkthrough

### Problem

Given the binary tree below, return its level order traversal as a list of lists.

```
        1
       / \
      2   3
     / \ / \
    4  5 6  7
```

**Input:** root = 1
**Output:** `[[1], [2, 3], [4, 5, 6, 7]]`

### Step-by-Step Trace

**Initial state:**

```
Queue:  [ 1 ]
Result: []
```

---

**Level 0 — process 1 node (levelSize = 1):**

Dequeue `1`. Enqueue its children `2` and `3`.

```
Queue before: [ 1 ]
  Dequeue 1 → enqueue 2, enqueue 3
Queue after:  [ 2, 3 ]

currentLevel = [1]
Result so far: [[1]]
```

---

**Level 1 — process 2 nodes (levelSize = 2):**

Dequeue `2`. Enqueue its children `4` and `5`.
Dequeue `3`. Enqueue its children `6` and `7`.

```
Queue before: [ 2, 3 ]
  Dequeue 2 → enqueue 4, enqueue 5
  Queue mid:  [ 3, 4, 5 ]
  Dequeue 3 → enqueue 6, enqueue 7
Queue after:  [ 4, 5, 6, 7 ]

currentLevel = [2, 3]
Result so far: [[1], [2, 3]]
```

---

**Level 2 — process 4 nodes (levelSize = 4):**

Dequeue `4`, `5`, `6`, `7`. All are leaves — no children to enqueue.

```
Queue before: [ 4, 5, 6, 7 ]
  Dequeue 4 → no children
  Dequeue 5 → no children
  Dequeue 6 → no children
  Dequeue 7 → no children
Queue after:  [ ]

currentLevel = [4, 5, 6, 7]
Result so far: [[1], [2, 3], [4, 5, 6, 7]]
```

---

**Queue is empty — traversal complete.**

```
Final result: [[1], [2, 3], [4, 5, 6, 7]]
```

**Level boundary visualization:**

```
        1           ← Level 0 (1 node)
       / \
      2   3         ← Level 1 (2 nodes)
     / \ / \
    4  5 6  7       ← Level 2 (4 nodes)
```

Each level doubles in node count for a perfect binary tree. The queue holds at most one full level at a time — here, 4 nodes at peak. For a balanced tree with n nodes, peak queue size is O(n/2) = O(n).

## Common Pitfalls

1. **Using a stack instead of a queue**

   BFS requires FIFO (First In, First Out). If you accidentally use a stack (LIFO), you get DFS behavior — nodes are processed in the wrong order and the level-by-level invariant breaks entirely. In languages where arrays serve as both stacks and queues (e.g., using `push`/`shift` in JavaScript), using `pop` instead of `shift` silently converts your BFS into a DFS with no error.

   Fix: Always verify you are using a queue. Use a named abstraction (`Queue`, `deque`, `ArrayDeque`) rather than a raw array when possible, so the intent is explicit.

2. **Snapshotting levelSize after modifications to the queue**

   The level boundary relies on recording `levelSize = queue.size()` before the inner loop. If you compute the size inside the loop condition (e.g., `while (queue.size() > 0)` inside the per-level iteration), you include nodes from the next level in the current level's processing, corrupting all per-level results.

   Fix: Always capture `levelSize` once, before the inner `for` loop, and iterate exactly that many times.

3. **Not handling null children before enqueuing**

   Enqueuing `null` children is a common source of null pointer exceptions. When you later dequeue and try to access `.value` or `.left` on a null node, the program crashes.

   Fix: Guard every enqueue with an explicit null check: `if node.left is not null: queue.enqueue(node.left)`.

4. **Confusing minimum depth with maximum depth**

   Maximum depth requires visiting all nodes (you don't know which level is the deepest until you finish). Minimum depth can be short-circuited the moment you dequeue a leaf — but only if you check for a leaf correctly. A node is a leaf only when both `left` and `right` are null. Checking only one child leads to incorrect early returns for nodes with one child.

   Fix: For minimum depth, the return condition is `node.left is null AND node.right is null`, not `node.left is null OR node.right is null`.

5. **Forgetting to handle an empty root**

   If the input tree is empty (`root is null`), the queue initialization `queue.enqueue(null)` will cause an immediate null dereference on the first dequeue. This edge case is easy to overlook when focusing on the traversal logic.

   Fix: Add an explicit early return at the top of the function: `if root is null: return []`.

## Interview Tips

1. **Draw the queue state, not just the tree.** When explaining BFS to an interviewer, draw a horizontal queue and show how nodes move through it level by level. This communicates that you understand the algorithm's mechanics, not just its output.

2. **Lead with the levelSize snapshot technique.** If the problem asks for any per-level aggregation, immediately mention that you'll snapshot `levelSize = queue.size()` before processing each level. This is the key insight that separates a novice BFS from a correct one, and saying it upfront signals fluency.

3. **State the BFS vs. DFS trade-off explicitly.** BFS finds the shallowest solution first at the cost of O(n) space. DFS explores full paths first with O(h) space. Mentioning this comparison shows you are choosing BFS deliberately, not reflexively.

4. **Know the four common variations by name.** Level order, zigzag, right-side view, and level averages all use the exact same BFS skeleton — only the per-level accumulation logic changes. Telling the interviewer "this is the standard BFS template; I only need to change how I record each level" demonstrates pattern mastery.

5. **Mention multi-source BFS as a follow-up.** If the interviewer asks about graphs (not just trees), note that the same pattern generalizes to multi-source BFS by seeding the initial queue with all starting nodes simultaneously. This is used in problems like "rotting oranges" or "walls and gates."

## Practice Progression

This section is auto-populated from algorithms in this repository that are tagged with the `tree-bfs` pattern. As more algorithms are added and linked, they will appear here organized by difficulty.

For external practice, a typical progression is: binary tree level order traversal (pure template application) before zigzag level order (requires direction-aware insertion) before right-side view (requires tracking last node per level) before minimum depth (requires early termination at leaf) before connect next-right pointers (requires using the queue to link nodes across the same level).

## Related Patterns

No related patterns are linked yet. As additional patterns are added to this repository, the following connection will be documented:

- **Tree Depth-First Search** — DFS is the natural complement to BFS on trees. Where BFS processes nodes level by level using a queue and finds the shallowest result first, DFS explores each path fully before backtracking using recursion (or an explicit stack) and is better suited for path-sum problems, subtree properties, and problems that require visiting all leaves. Many tree problems can be solved with either approach; the choice comes down to whether the problem cares about depth proximity (BFS) or full path exploration (DFS).

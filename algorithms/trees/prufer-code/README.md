# Prufer Code

## Overview

A Prufer sequence (or Prufer code) is a unique sequence of n - 2 integers that encodes a labeled tree on n vertices. This encoding establishes a bijection between labeled trees on n vertices and sequences of length n - 2 with elements from {1, 2, ..., n}. The existence of this bijection provides an elegant proof of Cayley's formula: the number of labeled trees on n vertices is n^(n-2).

Prufer codes are used in combinatorics, network design, and random tree generation. The encoding and decoding algorithms allow efficient conversion between tree representations and compact sequence representations.

## How It Works

**Encoding (tree to Prufer sequence):** Repeatedly find the leaf with the smallest label, add its neighbor to the Prufer sequence, and remove the leaf from the tree. Repeat until only two vertices remain.

**Decoding (Prufer sequence to tree):** Reconstruct the tree by iterating through the sequence. For each element in the sequence, find the smallest-labeled vertex not in the remaining sequence and not yet removed, connect it to the current sequence element, and remove it.

### Example

Given labeled tree on 6 vertices:

```
    1 --- 4 --- 3
          |
    2 --- 5 --- 6
```

Edges: {(1,4), (2,5), (3,4), (4,5), (5,6)}

**Encoding (tree to Prufer sequence):**

| Step | Smallest leaf | Neighbor | Prufer sequence | Remaining tree |
|------|--------------|----------|-----------------|----------------|
| 1 | 1 | 4 | [4] | Remove 1; leaves: {2, 3, 6} |
| 2 | 2 | 5 | [4, 5] | Remove 2; leaves: {3, 6} |
| 3 | 3 | 4 | [4, 5, 4] | Remove 3; leaves: {4, 6} |
| 4 | 4 | 5 | [4, 5, 4, 5] | Remove 4; leaves: {5, 6} |

Prufer sequence: `[4, 5, 4, 5]` (length n - 2 = 4)

**Decoding (Prufer sequence [4, 5, 4, 5] to tree):**

| Step | Sequence element | Smallest unused vertex not in remaining seq | Edge added |
|------|-----------------|----------------------------------------------|------------|
| 1 | 4 | 1 (not in {5,4,5}) | (1, 4) |
| 2 | 5 | 2 (not in {4,5}) | (2, 5) |
| 3 | 4 | 3 (not in {5}) | (3, 4) |
| 4 | 5 | 4 (not in {}) | (4, 5) |
| Final | - | Remaining: {5, 6} | (5, 6) |

Reconstructed edges: {(1,4), (2,5), (3,4), (4,5), (5,6)} -- matches the original tree.

## Pseudocode

```
function encode(tree, n):
    sequence = empty list
    degree = array of node degrees

    for step from 1 to n - 2:
        // Find smallest leaf
        leaf = smallest node with degree[node] == 1
        // Add its neighbor to sequence
        neighbor = the single neighbor of leaf
        sequence.append(neighbor)
        // Remove leaf
        degree[leaf] = 0
        degree[neighbor] = degree[neighbor] - 1

    return sequence

function decode(sequence, n):
    edges = empty list
    degree = array of size n+1, all initialized to 1
    for each element in sequence:
        degree[element] = degree[element] + 1

    for each element in sequence:
        // Find smallest vertex with degree 1
        for v from 1 to n:
            if degree[v] == 1:
                edges.append((v, element))
                degree[v] = degree[v] - 1
                degree[element] = degree[element] - 1
                break

    // Connect the last two vertices with degree 1
    last_two = [v for v from 1 to n if degree[v] == 1]
    edges.append((last_two[0], last_two[1]))

    return edges
```

The encoding repeatedly extracts the smallest leaf, while decoding reconstructs edges by pairing sequence elements with the smallest available degree-1 vertex.

## Complexity Analysis

| Case    | Time       | Space |
|---------|-----------|-------|
| Best    | O(n log n) | O(n)  |
| Average | O(n log n) | O(n)  |
| Worst   | O(n log n) | O(n)  |

**Why these complexities?**

- **Best Case -- O(n log n):** Finding the smallest leaf at each step can be done efficiently using a priority queue (min-heap), giving O(log n) per step and O(n log n) total. A naive implementation scanning all vertices is O(n^2).

- **Average Case -- O(n log n):** With a priority queue, both encoding and decoding perform n - 2 iterations with O(log n) work per iteration.

- **Worst Case -- O(n log n):** The priority queue operations dominate. Inserting and extracting from the heap is O(log n) in the worst case.

- **Space -- O(n):** The algorithm stores the Prufer sequence (n - 2 elements), degree array (n elements), and priority queue (at most n elements), all O(n).

## When to Use

- **Random tree generation:** Generating a uniformly random labeled tree by creating a random Prufer sequence and decoding it.
- **Proving combinatorial identities:** The Prufer sequence bijection is the standard proof of Cayley's formula.
- **Compact tree encoding:** Representing a labeled tree as a sequence of n - 2 integers.
- **Tree enumeration:** Systematically generating all labeled trees on n vertices.

## When NOT to Use

- **Unlabeled trees:** Prufer sequences only work with labeled trees (where vertex identity matters).
- **When tree structure must be preserved during manipulation:** The encoding/decoding process destroys and rebuilds the tree.
- **When you need rooted tree operations:** Prufer codes represent unrooted trees; rooted tree encodings differ.
- **Large trees with frequent structural changes:** The O(n log n) encoding/decoding is too expensive for frequent use.

## Comparison with Similar Algorithms

| Encoding Method    | Encode Time | Decode Time | Sequence Length | Notes                           |
|-------------------|------------|------------|----------------|----------------------------------|
| Prufer Code        | O(n log n) | O(n log n) | n - 2          | Bijection with labeled trees      |
| Parent Array       | O(n)       | O(n)       | n              | Stores parent of each node        |
| Adjacency List     | O(n)       | O(n)       | 2(n-1)         | Standard graph representation     |
| Euler Tour         | O(n)       | O(n)       | 2n - 1         | Used for subtree queries          |

## Implementations

| Language | File |
|----------|------|
| C++      | [PruferCode.cpp](cpp/PruferCode.cpp) |

## References

- Prufer, H. (1918). Neuer Beweis eines Satzes uber Permutationen. *Archiv fur Mathematik und Physik*, 27, 142-144.
- Cayley, A. (1889). A theorem on trees. *Quarterly Journal of Mathematics*, 23, 376-378.
- [Prufer Sequence -- Wikipedia](https://en.wikipedia.org/wiki/Pr%C3%BCfer_sequence)

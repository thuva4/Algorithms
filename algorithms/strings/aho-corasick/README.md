# Aho-Corasick

## Overview

The Aho-Corasick algorithm is a multi-pattern string matching algorithm that finds all occurrences of a set of patterns in a text in a single pass. It constructs a finite automaton (a trie with failure links) from the set of patterns, then processes the text character by character through this automaton. It achieves O(n + m + z) time, where n is the text length, m is the total length of all patterns, and z is the number of matches found.

Developed by Alfred Aho and Margaret Corasick in 1975, this algorithm is the foundation of tools like `fgrep` (fixed-string grep) and is used in intrusion detection systems, antivirus scanners, and computational biology for multi-pattern search.

## How It Works

The algorithm has three phases: (1) Build a trie from all patterns, (2) Construct failure links that connect each node to the longest proper suffix of the current prefix that is also a prefix of some pattern, and (3) Search the text by following trie edges and failure links. The failure links function similarly to KMP's failure function but for multiple patterns simultaneously.

### Example

Patterns: `["he", "she", "his", "hers"]`, Text: `"ushers"`

**Step 1: Build the trie:**

```
     (root)
     / | \
    h  s   (other chars)
    |  |
    e  h
   / \  \
  r   (match "he")  e
  |                  |
  s                (match "she")
  |
(match "hers")

    h
    |
    i
    |
    s
    |
  (match "his")
```

**Step 2: Failure links (key ones):**

| Node (prefix) | Failure link points to | Reason |
|---------------|----------------------|--------|
| "h" | root | No proper suffix is a prefix of any pattern |
| "sh" | "h" | "h" is suffix of "sh" and prefix in trie |
| "she" | "he" | "he" is suffix of "she" and a pattern! |
| "her" | root | No matching suffix prefix |
| "hi" | root | No matching suffix prefix |

**Step 3: Search through "ushers":**

| Step | Char | State (prefix) | Failure transitions | Matches found |
|------|------|----------------|--------------------|--------------|
| 1 | u | root (no 'u' edge) | Stay at root | - |
| 2 | s | "s" | - | - |
| 3 | h | "sh" | - | - |
| 4 | e | "she" | Also check "he" via failure | "she" at 1, "he" at 2 |
| 5 | r | "her" (from "he"+"r") | - | - |
| 6 | s | "hers" | - | "hers" at 2 |

Result: Found `"she"` at index 1, `"he"` at index 2, `"hers"` at index 2.

## Pseudocode

```
function buildTrie(patterns):
    root = new TrieNode
    for each pattern in patterns:
        node = root
        for each char c in pattern:
            if node.children[c] does not exist:
                node.children[c] = new TrieNode
            node = node.children[c]
        node.output.add(pattern)
    return root

function buildFailureLinks(root):
    queue = empty queue
    // Initialize depth-1 nodes
    for each child c of root:
        c.fail = root
        queue.enqueue(c)

    while queue is not empty:
        current = queue.dequeue()
        for each (char, child) in current.children:
            queue.enqueue(child)
            fail_state = current.fail
            while fail_state != root and char not in fail_state.children:
                fail_state = fail_state.fail
            child.fail = fail_state.children[char] if char in fail_state.children else root
            child.output = child.output union child.fail.output

function search(text, root):
    state = root
    results = empty list
    for i from 0 to length(text) - 1:
        while state != root and text[i] not in state.children:
            state = state.fail
        if text[i] in state.children:
            state = state.children[text[i]]
        for each pattern in state.output:
            results.append((i - length(pattern) + 1, pattern))
    return results
```

The failure links turn the trie into a finite automaton, ensuring that every character in the text is processed exactly once during the search phase.

## Complexity Analysis

| Case    | Time         | Space |
|---------|-------------|-------|
| Best    | O(n + m + z) | O(m)  |
| Average | O(n + m + z) | O(m)  |
| Worst   | O(n + m + z) | O(m)  |

**Why these complexities?**

- **Best Case -- O(n + m + z):** Building the trie takes O(m) where m is the sum of all pattern lengths. Building failure links takes O(m). The search phase processes each text character once in O(1) amortized time, and each match is reported in O(1).

- **Average Case -- O(n + m + z):** The automaton structure guarantees that processing each text character takes O(1) amortized time. The z term accounts for outputting all matches.

- **Worst Case -- O(n + m + z):** The algorithm is deterministic and maintains O(1) amortized per character even in the worst case. The output-sensitive z term can dominate if there are many overlapping matches.

- **Space -- O(m):** The trie has at most m nodes (one per character across all patterns). Each node stores children pointers and failure links. The alphabet size affects the constant factor.

## When to Use

- **Searching for multiple patterns simultaneously:** The primary use case -- finding all occurrences of many patterns in one text.
- **Intrusion detection and antivirus:** Scanning network packets or files against databases of known signatures.
- **DNA motif searching:** Finding multiple genetic patterns in genomic sequences.
- **When all patterns are known in advance:** The automaton is built once and can be reused for multiple texts.

## When NOT to Use

- **Single pattern matching:** KMP or Boyer-Moore is simpler and has less overhead for a single pattern.
- **When patterns change frequently:** Rebuilding the automaton is expensive. Consider suffix trees or arrays for dynamic pattern sets.
- **Approximate matching:** Aho-Corasick handles exact matching only. Use bitap or edit distance for fuzzy matching.
- **Very large alphabets:** The trie size grows with alphabet size. Hash-based children storage may be needed.

## Comparison with Similar Algorithms

| Algorithm      | Time         | Space | Notes                                          |
|---------------|-------------|-------|-------------------------------------------------|
| Aho-Corasick   | O(n + m + z)| O(m)  | Multi-pattern; builds automaton                  |
| KMP            | O(n + m)    | O(m)  | Single pattern; deterministic                    |
| Rabin-Karp     | O(nm) worst | O(1)  | Can search multiple patterns via hash set        |
| Commentz-Walter| O(n + m + z)| O(m)  | Multi-pattern Boyer-Moore variant                |

## Implementations

| Language | File |
|----------|------|
| Python   | [AhoCorasick.py](python/AhoCorasick.py) |

## References

- Aho, A. V., & Corasick, M. J. (1975). Efficient string matching: an aid to bibliographic search. *Communications of the ACM*, 18(6), 333-340.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 32: String Matching.
- [Aho-Corasick Algorithm -- Wikipedia](https://en.wikipedia.org/wiki/Aho%E2%80%93Corasick_algorithm)

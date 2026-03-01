# Trie (Prefix Tree)

## Overview

A Trie (pronounced "try"), also called a prefix tree or digital tree, is a tree-like data structure used for efficient retrieval of keys, typically strings. Unlike a binary search tree where each node stores a complete key, each node in a trie represents a single character (or digit), and the path from the root to a node spells out the key.

Tries are especially powerful for prefix-based operations such as autocomplete, spell checking, and IP routing. They provide O(m) lookup time where m is the key length, independent of the number of keys stored.

## How It Works

A trie stores keys by breaking them into individual characters (or digits for integers) and placing each character along a path from the root:

1. **Insert:** For each character in the key, traverse from the root, creating new child nodes as needed. Mark the final node as the end of a word.
2. **Search:** For each character in the key, traverse from the root following child pointers. If any character is missing, the key is not found. If all characters are found and the last node is marked as end-of-word, the key exists.

For this implementation, we use integer keys: the first half of the input array contains keys to insert, and the second half contains keys to search. The function returns how many searches succeed.

### Example

Given input: `[1, 2, 3, 4, 5, 1, 3, 5, 7, 9]`

First half (insert): 1, 2, 3, 4, 5
Second half (search): 1, 3, 5, 7, 9

| Operation | Key | Result |
|-----------|-----|--------|
| Insert    | 1   | Added  |
| Insert    | 2   | Added  |
| Insert    | 3   | Added  |
| Insert    | 4   | Added  |
| Insert    | 5   | Added  |
| Search    | 1   | Found  |
| Search    | 3   | Found  |
| Search    | 5   | Found  |
| Search    | 7   | Not found |
| Search    | 9   | Not found |

Result: 3 (three successful searches)

## Pseudocode

```
class TrieNode:
    children = {}
    isEnd = false

function insert(root, key):
    node = root
    for each character c in str(key):
        if c not in node.children:
            node.children[c] = new TrieNode()
        node = node.children[c]
    node.isEnd = true

function search(root, key):
    node = root
    for each character c in str(key):
        if c not in node.children:
            return false
        node = node.children[c]
    return node.isEnd

function trieInsertSearch(arr):
    n = length(arr)
    mid = n / 2
    root = new TrieNode()

    for i from 0 to mid - 1:
        insert(root, arr[i])

    count = 0
    for i from mid to n - 1:
        if search(root, arr[i]):
            count += 1

    return count
```

## Complexity Analysis

| Case    | Time | Space   |
|---------|------|---------|
| Best    | O(m) | O(n*m)  |
| Average | O(m) | O(n*m)  |
| Worst   | O(m) | O(n*m)  |

- **Time -- O(m):** Each insert or search operation traverses at most m characters (the key length). This is independent of the number of keys in the trie.
- **Space -- O(n*m):** In the worst case, n keys each of length m share no prefixes, requiring n*m nodes. In practice, shared prefixes reduce space significantly.

## Applications

- **Autocomplete:** Efficiently find all words with a given prefix.
- **Spell checking:** Quickly verify if a word exists in a dictionary.
- **IP routing:** Longest prefix matching in network routers.
- **Phone directories:** Contact search by prefix.
- **Word games:** Scrabble solvers and crossword helpers.
- **Genome analysis:** DNA sequence matching and indexing.

## Implementations

| Language   | File |
|------------|------|
| Python     | [trie_insert_search.py](python/trie_insert_search.py) |
| Java       | [Trie.java](java/Trie.java) |
| C++        | [trie_insert_search.cpp](cpp/trie_insert_search.cpp) |
| C          | [trie_insert_search.c](c/trie_insert_search.c) |
| Go         | [trie_insert_search.go](go/trie_insert_search.go) |
| TypeScript | [trieInsertSearch.ts](typescript/trieInsertSearch.ts) |
| Kotlin     | [Trie.kt](kotlin/Trie.kt) |
| Rust       | [trie_insert_search.rs](rust/trie_insert_search.rs) |
| Swift      | [Trie.swift](swift/Trie.swift) |
| Scala      | [Trie.scala](scala/Trie.scala) |
| C#         | [Trie.cs](csharp/Trie.cs) |

## References

- Fredkin, E. (1960). "Trie Memory." *Communications of the ACM*, 3(9), 490-499.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press.
- [Trie -- Wikipedia](https://en.wikipedia.org/wiki/Trie)

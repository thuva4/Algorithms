package trie

import "strconv"

type trieNode struct {
	children map[byte]*trieNode
	isEnd    bool
}

func newTrieNode() *trieNode {
	return &trieNode{children: make(map[byte]*trieNode)}
}

func insert(root *trieNode, key int) {
	node := root
	s := strconv.Itoa(key)
	for i := 0; i < len(s); i++ {
		ch := s[i]
		if _, ok := node.children[ch]; !ok {
			node.children[ch] = newTrieNode()
		}
		node = node.children[ch]
	}
	node.isEnd = true
}

func search(root *trieNode, key int) bool {
	node := root
	s := strconv.Itoa(key)
	for i := 0; i < len(s); i++ {
		ch := s[i]
		if _, ok := node.children[ch]; !ok {
			return false
		}
		node = node.children[ch]
	}
	return node.isEnd
}

// TrieInsertSearch inserts the first half of arr into a trie and searches
// for the second half, returning the count of successful searches.
func TrieInsertSearch(arr []int) int {
	n := len(arr)
	mid := n / 2
	root := newTrieNode()

	for i := 0; i < mid; i++ {
		insert(root, arr[i])
	}

	count := 0
	for i := mid; i < n; i++ {
		if search(root, arr[i]) {
			count++
		}
	}

	return count
}

package ahocorasick

import "sort"

// TrieNode represents a node in the Aho-Corasick automaton.
type TrieNode struct {
	children map[byte]int
	fail     int
	output   []int
}

// AhoCorasick is the string matching automaton.
type AhoCorasick struct {
	trie     []TrieNode
	patterns []string
}

// NewAhoCorasick builds the automaton from the given patterns.
func NewAhoCorasick(patterns []string) *AhoCorasick {
	ac := &AhoCorasick{
		patterns: patterns,
		trie:     []TrieNode{{children: make(map[byte]int), fail: 0}},
	}
	ac.buildTrie()
	ac.buildFailLinks()
	return ac
}

func (ac *AhoCorasick) buildTrie() {
	for i, pat := range ac.patterns {
		cur := 0
		for j := 0; j < len(pat); j++ {
			c := pat[j]
			if _, ok := ac.trie[cur].children[c]; !ok {
				ac.trie[cur].children[c] = len(ac.trie)
				ac.trie = append(ac.trie, TrieNode{children: make(map[byte]int)})
			}
			cur = ac.trie[cur].children[c]
		}
		ac.trie[cur].output = append(ac.trie[cur].output, i)
	}
}

func (ac *AhoCorasick) buildFailLinks() {
	queue := []int{}
	for _, child := range ac.trie[0].children {
		ac.trie[child].fail = 0
		queue = append(queue, child)
	}

	for len(queue) > 0 {
		u := queue[0]
		queue = queue[1:]
		for c, v := range ac.trie[u].children {
			f := ac.trie[u].fail
			for f != 0 {
				if _, ok := ac.trie[f].children[c]; ok {
					break
				}
				f = ac.trie[f].fail
			}
			if child, ok := ac.trie[f].children[c]; ok && child != v {
				ac.trie[v].fail = child
			} else {
				ac.trie[v].fail = 0
			}
			ac.trie[v].output = append(ac.trie[v].output, ac.trie[ac.trie[v].fail].output...)
			queue = append(queue, v)
		}
	}
}

// Match represents a pattern match with the pattern string and start index.
type Match struct {
	Pattern string
	Index   int
}

// Search finds all occurrences of patterns in the text.
func (ac *AhoCorasick) Search(text string) []Match {
	var results []Match
	cur := 0
	for i := 0; i < len(text); i++ {
		c := text[i]
		for cur != 0 {
			if _, ok := ac.trie[cur].children[c]; ok {
				break
			}
			cur = ac.trie[cur].fail
		}
		if child, ok := ac.trie[cur].children[c]; ok {
			cur = child
		}
		for _, idx := range ac.trie[cur].output {
			results = append(results, Match{
				Pattern: ac.patterns[idx],
				Index:   i - len(ac.patterns[idx]) + 1,
			})
		}
	}
	return results
}

func aho_corasick_search(text string, patterns []string) [][]interface{} {
	matches := NewAhoCorasick(patterns).Search(text)
	order := make(map[string]int, len(patterns))
	for i, pattern := range patterns {
		if _, exists := order[pattern]; !exists {
			order[pattern] = i
		}
	}
	sort.SliceStable(matches, func(i, j int) bool {
		endI := matches[i].Index + len(matches[i].Pattern) - 1
		endJ := matches[j].Index + len(matches[j].Pattern) - 1
		if endI != endJ {
			return endI < endJ
		}
		return order[matches[i].Pattern] < order[matches[j].Pattern]
	})
	result := make([][]interface{}, 0, len(matches))
	for _, match := range matches {
		result = append(result, []interface{}{match.Pattern, match.Index})
	}
	return result
}

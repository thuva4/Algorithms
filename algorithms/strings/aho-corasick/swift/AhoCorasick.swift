class AhoCorasickNode {
    var children = [Character: Int]()
    var fail = 0
    var output = [Int]()
}

class AhoCorasick {
    private var trie = [AhoCorasickNode]()
    private var patterns: [String]

    init(patterns: [String]) {
        self.patterns = patterns
        trie.append(AhoCorasickNode())
        buildTrie()
        buildFailLinks()
    }

    private func buildTrie() {
        for i in 0..<patterns.count {
            var cur = 0
            for c in patterns[i] {
                if trie[cur].children[c] == nil {
                    trie[cur].children[c] = trie.count
                    trie.append(AhoCorasickNode())
                }
                cur = trie[cur].children[c]!
            }
            trie[cur].output.append(i)
        }
    }

    private func buildFailLinks() {
        var queue = [Int]()
        for (_, child) in trie[0].children {
            trie[child].fail = 0
            queue.append(child)
        }

        while !queue.isEmpty {
            let u = queue.removeFirst()
            for (c, v) in trie[u].children {
                var f = trie[u].fail
                while f != 0 && trie[f].children[c] == nil {
                    f = trie[f].fail
                }
                if let fc = trie[f].children[c], fc != v {
                    trie[v].fail = fc
                } else {
                    trie[v].fail = 0
                }
                trie[v].output.append(contentsOf: trie[trie[v].fail].output)
                queue.append(v)
            }
        }
    }

    func search(_ text: String) -> [(String, Int)] {
        var results = [(String, Int)]()
        let chars = Array(text)
        var cur = 0
        for i in 0..<chars.count {
            let c = chars[i]
            while cur != 0 && trie[cur].children[c] == nil {
                cur = trie[cur].fail
            }
            if let next = trie[cur].children[c] {
                cur = next
            }
            for idx in trie[cur].output {
                results.append((patterns[idx], i - patterns[idx].count + 1))
            }
        }
        return results
    }
}

func ahoCorasickSearch(_ text: String, _ patterns: [String]) -> [String] {
    let automaton = AhoCorasick(patterns: patterns)
    let patternOrder = Dictionary(uniqueKeysWithValues: patterns.enumerated().map { ($0.element, $0.offset) })
    let matches = automaton.search(text).sorted { lhs, rhs in
        let lhsEnd = lhs.1 + lhs.0.count - 1
        let rhsEnd = rhs.1 + rhs.0.count - 1
        if lhsEnd != rhsEnd {
            return lhsEnd < rhsEnd
        }
        return (patternOrder[lhs.0] ?? Int.max) < (patternOrder[rhs.0] ?? Int.max)
    }
    return matches.flatMap { [$0.0, String($0.1)] }
}

let ac = AhoCorasick(patterns: ["he", "she", "his", "hers"])
let results = ac.search("ahishers")
for (word, index) in results {
    print("Word \"\(word)\" found at index \(index)")
}

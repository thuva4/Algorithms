class TrieNode {
    var children: [Character: TrieNode] = [:]
    var isEnd: Bool = false
}

func trieInsertSearch(_ arr: [Int]) -> Int {
    let n = arr.count
    let mid = n / 2
    let root = TrieNode()

    func insert(_ key: Int) {
        var node = root
        for ch in String(key) {
            if node.children[ch] == nil {
                node.children[ch] = TrieNode()
            }
            node = node.children[ch]!
        }
        node.isEnd = true
    }

    func search(_ key: Int) -> Bool {
        var node = root
        for ch in String(key) {
            guard let child = node.children[ch] else {
                return false
            }
            node = child
        }
        return node.isEnd
    }

    for i in 0..<mid {
        insert(arr[i])
    }

    var count = 0
    for i in mid..<n {
        if search(arr[i]) {
            count += 1
        }
    }

    return count
}

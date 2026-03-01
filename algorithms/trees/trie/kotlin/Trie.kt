class TrieNode {
    val children = mutableMapOf<Char, TrieNode>()
    var isEnd = false
}

fun trieInsertSearch(arr: IntArray): Int {
    val n = arr.size
    val mid = n / 2
    val root = TrieNode()

    fun insert(key: Int) {
        var node = root
        for (ch in key.toString()) {
            node = node.children.getOrPut(ch) { TrieNode() }
        }
        node.isEnd = true
    }

    fun search(key: Int): Boolean {
        var node = root
        for (ch in key.toString()) {
            node = node.children[ch] ?: return false
        }
        return node.isEnd
    }

    for (i in 0 until mid) {
        insert(arr[i])
    }

    var count = 0
    for (i in mid until n) {
        if (search(arr[i])) {
            count++
        }
    }

    return count
}

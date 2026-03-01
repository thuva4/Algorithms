private const val T = 3
private const val MAX_KEYS = 2 * T - 1

private class BTreeNode(var leaf: Boolean = true) {
    val keys = mutableListOf<Int>()
    val children = mutableListOf<BTreeNode>()
}

private fun splitChild(parent: BTreeNode, i: Int) {
    val full = parent.children[i]
    val newNode = BTreeNode(full.leaf)
    val mid = T - 1
    for (j in T until full.keys.size) {
        newNode.keys.add(full.keys[j])
    }
    val median = full.keys[mid]
    if (!full.leaf) {
        for (j in T until full.children.size) {
            newNode.children.add(full.children[j])
        }
        while (full.children.size > T) full.children.removeAt(full.children.size - 1)
    }
    while (full.keys.size > mid) full.keys.removeAt(full.keys.size - 1)
    parent.keys.add(i, median)
    parent.children.add(i + 1, newNode)
}

private fun insertNonFull(node: BTreeNode, key: Int) {
    if (node.leaf) {
        val pos = node.keys.indexOfFirst { it > key }.let { if (it == -1) node.keys.size else it }
        node.keys.add(pos, key)
    } else {
        var i = node.keys.size - 1
        while (i >= 0 && key < node.keys[i]) i--
        i++
        if (node.children[i].keys.size == MAX_KEYS) {
            splitChild(node, i)
            if (key > node.keys[i]) i++
        }
        insertNonFull(node.children[i], key)
    }
}

private fun inorder(node: BTreeNode?, result: MutableList<Int>) {
    if (node == null) return
    for (i in 0 until node.keys.size) {
        if (!node.leaf) inorder(node.children[i], result)
        result.add(node.keys[i])
    }
    if (!node.leaf) inorder(node.children[node.keys.size], result)
}

fun bTree(arr: IntArray): IntArray {
    if (arr.isEmpty()) return intArrayOf()
    var root = BTreeNode(true)
    for (v in arr) {
        if (root.keys.size == MAX_KEYS) {
            val newRoot = BTreeNode(false)
            newRoot.children.add(root)
            splitChild(newRoot, 0)
            root = newRoot
        }
        insertNonFull(root, v)
    }
    val result = mutableListOf<Int>()
    inorder(root, result)
    return result.toIntArray()
}

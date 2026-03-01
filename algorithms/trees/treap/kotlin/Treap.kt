import kotlin.random.Random

private class TreapNode(val key: Int) {
    val priority = Random.nextInt()
    var left: TreapNode? = null
    var right: TreapNode? = null
}

private fun rightRot(p: TreapNode): TreapNode {
    val q = p.left!!
    p.left = q.right
    q.right = p
    return q
}

private fun leftRot(p: TreapNode): TreapNode {
    val q = p.right!!
    p.right = q.left
    q.left = p
    return q
}

private fun insertNode(root: TreapNode?, key: Int): TreapNode {
    if (root == null) return TreapNode(key)
    var node = root
    if (key < node.key) {
        node.left = insertNode(node.left, key)
        if (node.left!!.priority > node.priority) node = rightRot(node)
    } else if (key > node.key) {
        node.right = insertNode(node.right, key)
        if (node.right!!.priority > node.priority) node = leftRot(node)
    }
    return node
}

private fun inorderCollect(node: TreapNode?, result: MutableList<Int>) {
    if (node == null) return
    inorderCollect(node.left, result)
    result.add(node.key)
    inorderCollect(node.right, result)
}

fun treap(arr: IntArray): IntArray {
    var root: TreapNode? = null
    for (v in arr) root = insertNode(root, v)
    val result = mutableListOf<Int>()
    inorderCollect(root, result)
    return result.toIntArray()
}

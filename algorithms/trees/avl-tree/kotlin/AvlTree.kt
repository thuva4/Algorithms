fun avlInsertInorder(arr: IntArray): IntArray {
    class Node(val key: Int) {
        var left: Node? = null
        var right: Node? = null
        var height: Int = 1
    }

    fun height(node: Node?): Int = node?.height ?: 0

    fun updateHeight(node: Node) {
        node.height = 1 + maxOf(height(node.left), height(node.right))
    }

    fun balanceFactor(node: Node): Int = height(node.left) - height(node.right)

    fun rotateRight(y: Node): Node {
        val x = y.left!!
        val t2 = x.right
        x.right = y
        y.left = t2
        updateHeight(y)
        updateHeight(x)
        return x
    }

    fun rotateLeft(x: Node): Node {
        val y = x.right!!
        val t2 = y.left
        y.left = x
        x.right = t2
        updateHeight(x)
        updateHeight(y)
        return y
    }

    fun insert(node: Node?, key: Int): Node {
        if (node == null) return Node(key)
        if (key < node.key) node.left = insert(node.left, key)
        else if (key > node.key) node.right = insert(node.right, key)
        else return node

        updateHeight(node)
        val bf = balanceFactor(node)

        if (bf > 1 && key < node.left!!.key) return rotateRight(node)
        if (bf < -1 && key > node.right!!.key) return rotateLeft(node)
        if (bf > 1 && key > node.left!!.key) {
            node.left = rotateLeft(node.left!!)
            return rotateRight(node)
        }
        if (bf < -1 && key < node.right!!.key) {
            node.right = rotateRight(node.right!!)
            return rotateLeft(node)
        }

        return node
    }

    fun inorder(node: Node?, result: MutableList<Int>) {
        if (node == null) return
        inorder(node.left, result)
        result.add(node.key)
        inorder(node.right, result)
    }

    var root: Node? = null
    for (v in arr) root = insert(root, v)
    val result = mutableListOf<Int>()
    inorder(root, result)
    return result.toIntArray()
}

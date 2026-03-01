class BSTNode(val key: Int) {
    var left: BSTNode? = null
    var right: BSTNode? = null
}

fun bstInorder(arr: IntArray): IntArray {
    fun insert(root: BSTNode?, key: Int): BSTNode {
        if (root == null) {
            return BSTNode(key)
        }
        if (key <= root.key) {
            root.left = insert(root.left, key)
        } else {
            root.right = insert(root.right, key)
        }
        return root
    }

    fun inorder(root: BSTNode?, result: MutableList<Int>) {
        if (root == null) return
        inorder(root.left, result)
        result.add(root.key)
        inorder(root.right, result)
    }

    var root: BSTNode? = null
    for (key in arr) {
        root = insert(root, key)
    }

    val result = mutableListOf<Int>()
    inorder(root, result)
    return result.toIntArray()
}

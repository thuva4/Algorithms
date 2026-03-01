fun rbInsertInorder(arr: IntArray): IntArray {
    class Node(val key: Int) {
        var left: Node? = null
        var right: Node? = null
        var parent: Node? = null
        var color: Boolean = true // true = RED
    }

    var root: Node? = null

    fun rotateLeft(x: Node) {
        val y = x.right!!
        x.right = y.left
        if (y.left != null) y.left!!.parent = x
        y.parent = x.parent
        if (x.parent == null) root = y
        else if (x == x.parent!!.left) x.parent!!.left = y
        else x.parent!!.right = y
        y.left = x
        x.parent = y
    }

    fun rotateRight(x: Node) {
        val y = x.left!!
        x.left = y.right
        if (y.right != null) y.right!!.parent = x
        y.parent = x.parent
        if (x.parent == null) root = y
        else if (x == x.parent!!.right) x.parent!!.right = y
        else x.parent!!.left = y
        y.right = x
        x.parent = y
    }

    fun fixInsert(z: Node) {
        var node = z
        while (node.parent != null && node.parent!!.color) {
            val gp = node.parent!!.parent!!
            if (node.parent == gp.left) {
                val y = gp.right
                if (y != null && y.color) {
                    node.parent!!.color = false
                    y.color = false
                    gp.color = true
                    node = gp
                } else {
                    if (node == node.parent!!.right) {
                        node = node.parent!!
                        rotateLeft(node)
                    }
                    node.parent!!.color = false
                    node.parent!!.parent!!.color = true
                    rotateRight(node.parent!!.parent!!)
                }
            } else {
                val y = gp.left
                if (y != null && y.color) {
                    node.parent!!.color = false
                    y.color = false
                    gp.color = true
                    node = gp
                } else {
                    if (node == node.parent!!.left) {
                        node = node.parent!!
                        rotateRight(node)
                    }
                    node.parent!!.color = false
                    node.parent!!.parent!!.color = true
                    rotateLeft(node.parent!!.parent!!)
                }
            }
        }
        root!!.color = false
    }

    fun insert(key: Int) {
        var y: Node? = null
        var x = root
        while (x != null) {
            y = x
            x = if (key < x.key) x.left else if (key > x.key) x.right else return
        }
        val node = Node(key)
        node.parent = y
        if (y == null) root = node
        else if (key < y.key) y.left = node
        else y.right = node
        fixInsert(node)
    }

    fun inorder(node: Node?, result: MutableList<Int>) {
        if (node == null) return
        inorder(node.left, result)
        result.add(node.key)
        inorder(node.right, result)
    }

    for (v in arr) insert(v)
    val result = mutableListOf<Int>()
    inorder(root, result)
    return result.toIntArray()
}

import java.util.LinkedList

class TreeNode(val value: Int) {
    var left: TreeNode? = null
    var right: TreeNode? = null
}

fun buildTree(arr: Array<Int?>): TreeNode? {
    if (arr.isEmpty() || arr[0] == null) return null

    val nodes = Array<TreeNode?>(arr.size) { index ->
        arr[index]?.let { TreeNode(it) }
    }

    for (i in nodes.indices) {
        val node = nodes[i] ?: continue
        val leftIndex = 2 * i + 1
        val rightIndex = 2 * i + 2
        node.left = if (leftIndex < nodes.size) nodes[leftIndex] else null
        node.right = if (rightIndex < nodes.size) nodes[rightIndex] else null
    }

    return nodes[0]
}

fun levelOrderTraversal(arr: Array<Int?>): List<Int> {
    val root = buildTree(arr) ?: return emptyList()
    val result = mutableListOf<Int>()
    val queue = LinkedList<TreeNode>()
    queue.add(root)

    while (queue.isNotEmpty()) {
        val node = queue.poll()
        result.add(node.value)
        node.left?.let { queue.add(it) }
        node.right?.let { queue.add(it) }
    }
    return result
}

fun main() {
    val arr = arrayOf<Int?>(1, 2, 3, 4, 5, 6, 7)
    println("Level order: ${levelOrderTraversal(arr)}")
}

package algorithms.sorting.treesort

class TreeSort {
    class Node(var key: Int) {
        var left: Node? = null
        var right: Node? = null
    }

    fun sort(arr: IntArray) {
        if (arr.isEmpty()) return
        
        var root: Node? = null
        for (value in arr) {
            root = insert(root, value)
        }

        var index = 0
        storeSorted(root, arr) { index++ }
    }

    private fun insert(root: Node?, key: Int): Node {
        if (root == null) {
            return Node(key)
        }

        if (key < root.key) {
            root.left = insert(root.left, key)
        } else {
            root.right = insert(root.right, key)
        }

        return root
    }

    private fun storeSorted(root: Node?, arr: IntArray, getAndIncrementIndex: () -> Int) {
        if (root != null) {
            storeSorted(root.left, arr, getAndIncrementIndex)
            arr[getAndIncrementIndex()] = root.key
            storeSorted(root.right, arr, getAndIncrementIndex)
        }
    }
}

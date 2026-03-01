private fun inorderHelper(arr: IntArray, i: Int, result: MutableList<Int>) {
    if (i >= arr.size || arr[i] == -1) return
    inorderHelper(arr, 2 * i + 1, result)
    result.add(arr[i])
    inorderHelper(arr, 2 * i + 2, result)
}

fun treeTraversals(arr: IntArray): IntArray {
    val result = mutableListOf<Int>()
    inorderHelper(arr, 0, result)
    return result.toIntArray()
}

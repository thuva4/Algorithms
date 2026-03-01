fun subsetSum(arr: IntArray, target: Int): Int {
    return if (backtrack(arr, 0, target)) 1 else 0
}

private fun backtrack(arr: IntArray, index: Int, remaining: Int): Boolean {
    if (remaining == 0) return true
    if (index >= arr.size) return false

    // Include arr[index]
    if (backtrack(arr, index + 1, remaining - arr[index])) return true

    // Exclude arr[index]
    if (backtrack(arr, index + 1, remaining)) return true

    return false
}

fun zFunction(arr: IntArray): IntArray {
    val n = arr.size
    val z = IntArray(n)
    var l = 0
    var r = 0
    for (i in 1 until n) {
        if (i < r) {
            z[i] = minOf(r - i, z[i - l])
        }
        while (i + z[i] < n && arr[z[i]] == arr[i + z[i]]) {
            z[i]++
        }
        if (i + z[i] > r) {
            l = i
            r = i + z[i]
        }
    }
    return z
}

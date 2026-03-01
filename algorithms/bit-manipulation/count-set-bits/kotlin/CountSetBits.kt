fun countSetBits(arr: IntArray): Int {
    var total = 0
    for (num in arr) {
        var n = num
        while (n != 0) {
            total++
            n = n and (n - 1)
        }
    }
    return total
}

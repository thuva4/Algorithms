fun stackOps(arr: IntArray): Int {
    if (arr.isEmpty()) return 0
    val stack = mutableListOf<Int>()
    val opCount = arr[0]
    var idx = 1
    var total = 0
    for (i in 0 until opCount) {
        val type = arr[idx]; val v = arr[idx + 1]; idx += 2
        if (type == 1) stack.add(v)
        else if (type == 2) total += if (stack.isNotEmpty()) stack.removeAt(stack.size - 1) else -1
    }
    return total
}

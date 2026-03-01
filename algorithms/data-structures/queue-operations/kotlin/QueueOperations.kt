import java.util.LinkedList

fun queueOps(arr: IntArray): Int {
    if (arr.isEmpty()) return 0
    val queue = LinkedList<Int>()
    val opCount = arr[0]
    var idx = 1; var total = 0
    for (i in 0 until opCount) {
        val type = arr[idx]; val v = arr[idx + 1]; idx += 2
        if (type == 1) queue.add(v)
        else if (type == 2 && queue.isNotEmpty()) total += queue.poll()
    }
    return total
}

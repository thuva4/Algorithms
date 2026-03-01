fun jobScheduling(arr: IntArray): Int {
    val n = arr[0]
    data class Job(val deadline: Int, val profit: Int)

    val jobs = Array(n) { Job(arr[1 + 2 * it], arr[1 + 2 * it + 1]) }
    val maxDeadline = jobs.maxOf { it.deadline }

    val sorted = jobs.sortedByDescending { it.profit }
    val slots = BooleanArray(maxDeadline + 1)
    var totalProfit = 0

    for (job in sorted) {
        for (t in minOf(job.deadline, maxDeadline) downTo 1) {
            if (!slots[t]) {
                slots[t] = true
                totalProfit += job.profit
                break
            }
        }
    }

    return totalProfit
}

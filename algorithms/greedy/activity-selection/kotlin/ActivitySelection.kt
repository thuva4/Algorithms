fun activitySelection(arr: IntArray): Int {
    val n = arr.size / 2
    if (n == 0) {
        return 0
    }

    val activities = Array(n) { i -> Pair(arr[2 * i], arr[2 * i + 1]) }
    activities.sortBy { it.second }

    var count = 1
    var lastFinish = activities[0].second

    for (i in 1 until n) {
        if (activities[i].first >= lastFinish) {
            count++
            lastFinish = activities[i].second
        }
    }

    return count
}

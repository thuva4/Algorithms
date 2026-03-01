fun eggDrop(arr: IntArray): Int {
    val eggs = arr[0]; val floors = arr[1]
    val dp = Array(eggs + 1) { IntArray(floors + 1) }
    for (f in 1..floors) dp[1][f] = f
    for (e in 2..eggs) {
        for (f in 1..floors) {
            dp[e][f] = Int.MAX_VALUE
            for (x in 1..f) {
                val worst = 1 + maxOf(dp[e - 1][x - 1], dp[e][f - x])
                dp[e][f] = minOf(dp[e][f], worst)
            }
        }
    }
    return dp[eggs][floors]
}

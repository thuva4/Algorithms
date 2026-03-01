fun digitDp(n: Int, targetSum: Int): Int {
    if (n <= 0) return 0

    val s = n.toString()
    val digits = s.map { it - '0' }
    val numDigits = digits.size
    val maxSum = 9 * numDigits

    if (targetSum > maxSum) return 0

    val memo = Array(numDigits) { Array(maxSum + 1) { IntArray(2) { -1 } } }

    fun solve(pos: Int, currentSum: Int, tight: Int): Int {
        if (currentSum > targetSum) return 0
        if (pos == numDigits) {
            return if (currentSum == targetSum) 1 else 0
        }
        if (memo[pos][currentSum][tight] != -1) {
            return memo[pos][currentSum][tight]
        }

        val limit = if (tight == 1) digits[pos] else 9
        var result = 0
        for (d in 0..limit) {
            val newTight = if (tight == 1 && d == limit) 1 else 0
            result += solve(pos + 1, currentSum + d, newTight)
        }

        memo[pos][currentSum][tight] = result
        return result
    }

    val count = solve(0, 0, 1)
    return if (targetSum == 0) count - 1 else count
}

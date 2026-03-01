/**
 * Determine if target can be formed by summing elements from arr
 * with repetition allowed.
 *
 * @param arr array of positive integers (available elements)
 * @param target the target sum to reach
 * @return 1 if target is achievable, 0 otherwise
 */
fun canSum(arr: IntArray, target: Int): Int {
    if (target == 0) return 1

    val dp = BooleanArray(target + 1)
    dp[0] = true

    for (i in 1..target) {
        for (elem in arr) {
            if (elem <= i && dp[i - elem]) {
                dp[i] = true
                break
            }
        }
    }

    return if (dp[target]) 1 else 0
}

fun main() {
    println(canSum(intArrayOf(2, 3), 7))   // 1
    println(canSum(intArrayOf(5, 3), 8))   // 1
    println(canSum(intArrayOf(2, 4), 7))   // 0
    println(canSum(intArrayOf(1), 5))      // 1
    println(canSum(intArrayOf(7), 3))      // 0
}

/**
 * Power of Two Check
 *
 * Determines whether a given integer is a power of two using the
 * bitwise trick: n and (n - 1) == 0. A power of two has exactly one
 * set bit in binary, so clearing the lowest set bit yields zero.
 *
 * @param n The integer to check
 * @return 1 if n is a power of two, 0 otherwise
 */
fun powerOfTwoCheck(n: Int): Int {
    if (n <= 0) return 0
    return if (n and (n - 1) == 0) 1 else 0
}

/**
 * Test the powerOfTwoCheck function with various inputs.
 */
fun main() {
    val testCases = listOf(
        Pair(1, 1),     // 2^0
        Pair(2, 1),     // 2^1
        Pair(3, 0),     // not a power of two
        Pair(4, 1),     // 2^2
        Pair(16, 1),    // 2^4
        Pair(18, 0),    // not a power of two
        Pair(0, 0),     // edge case: zero
        Pair(-4, 0),    // edge case: negative
        Pair(1024, 1),  // 2^10
    )

    for ((value, expected) in testCases) {
        val result = powerOfTwoCheck(value)
        val status = if (result == expected) "PASS" else "FAIL"
        println("[$status] powerOfTwoCheck($value) = $result (expected $expected)")
    }
}

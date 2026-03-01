fun modPow(base: Long, exp: Long, mod: Long): Long {
    var b = base % mod; var e = exp; var result = 1L
    while (e > 0) {
        if (e and 1L == 1L) result = result * b % mod
        e = e shr 1
        b = b * b % mod
    }
    return result
}

fun discreteLogarithm(base: Long, target: Long, modulus: Long): Int {
    if (modulus == 1L) return 0
    val normalizedTarget = ((target % modulus) + modulus) % modulus
    var value = 1L % modulus
    for (exponent in 0 until modulus.toInt()) {
        if (value == normalizedTarget) {
            return exponent
        }
        value = value * (base % modulus) % modulus
    }
    return -1
}

fun main() {
    println(discreteLogarithm(2, 8, 13))
    println(discreteLogarithm(5, 1, 7))
    println(discreteLogarithm(3, 3, 11))
    println(discreteLogarithm(3, 13, 17))
}

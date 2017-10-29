/**
 * Calculates the greatest common divisor of two natural numbers.
 *
 * @author Sarah Khan
 */

/**
 * Calculates the greatest common divisor of two natural numbers using the Euclidean algorithm.
 *
 * @param num1 natural number
 * @param num2 natural number
 * @return the largest natural number that divides a and b without leaving a remainder
 */
fun gcd(num1: Int, num2: Int): Int {
    var a = num1
    var b = num2
    while (b != 0) {
        val temp = b
        b = a % b
        a = temp
    }
    return a
}

fun main(args: Array<String>) {
    println(gcd(10, 5))
    println(gcd(5, 10))
    println(gcd(10, 8))
    println(gcd(8, 2))
    println(gcd(7000, 2000))
    println(gcd(2000, 7000))
    println(gcd(10, 11))
    println(gcd(11, 7))
    println(gcd(239, 293))
}
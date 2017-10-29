/**
 * The binary GCD algorithm, also known as Stein's algorithm, is an algorithm
 * that computes the greatest common divisor of two non-negative integers.
 *
 * @author Huzaifa Iftikhar
 * @see [Binary GCD algorithm](https://en.wikipedia.org/wiki/Binary_GCD_algorithm)
 *
 * @see [Stein’s Algorithm for finding GCD](http://www.geeksforgeeks.org/steins-algorithm-for-finding-gcd/)
 */

/**
 * Stein's algorithm uses simpler arithmetic operations than the conventional Euclidean algorithm,
 * replaces division with arithmetic shifts, comparisons, and subtraction
 *
 * @param a
 * @param b
 * @return
 */
fun gcd(num1: Int, num2: Int): Int {
    var a = num1
    var b = num2
    // gcd(0,b) == b; gcd(a,0) == a, gcd(0,0) == 0
    if (a == 0) {
        return b
    }
    if (b == 0) {
        return a
    }

    // find the greatest power of 2 dividing both 'a' and 'b'
    var shift = 0
    while (a or b and 1 == 0) {
        a = a ushr 1
        b = b ushr 1
        shift++
    }

    // divide 'a' by 2 until 'a' becomes odd
    while (a and 1 == 0) {
        a = a ushr 1
    }

    // from here on, 'a' is always odd
    while (b != 0) {
        // remove all factor of 2 in 'b'
        while (b and 1 == 0) {
            b = b ushr 1
        }
        // Now 'a' and 'b' are both odd. If 'a' > 'b' swap, subtract 'a' from 'b'
        if (a > b) {
            val tmp = a
            a = b
            b = tmp
        }
        b -= a
    }
    // restore common factors of 2
    return a shl shift
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
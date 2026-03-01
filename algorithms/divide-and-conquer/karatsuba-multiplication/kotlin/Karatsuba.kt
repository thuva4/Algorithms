import kotlin.math.abs
import kotlin.math.max
import kotlin.math.pow

fun karatsuba(arr: IntArray): Int {
    fun multiply(x: Long, y: Long): Long {
        if (x < 10 || y < 10) return x * y

        val n = max(abs(x).toString().length, abs(y).toString().length)
        val half = n / 2
        val power = 10.0.pow(half).toLong()

        val x1 = x / power; val x0 = x % power
        val y1 = y / power; val y0 = y % power

        val z0 = multiply(x0, y0)
        val z2 = multiply(x1, y1)
        val z1 = multiply(x0 + x1, y0 + y1) - z0 - z2

        return z2 * power * power + z1 * power + z0
    }

    return multiply(arr[0].toLong(), arr[1].toLong()).toInt()
}

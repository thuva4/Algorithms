import kotlin.math.abs
import kotlin.math.min

fun gcd(a: Long, b: Long): Long {
    var x = abs(a); var y = abs(b)
    while (y != 0L) { val t = y; y = x % y; x = t }
    return x
}

fun isPrime(n: Long): Boolean {
    if (n < 2) return false
    if (n < 4) return true
    if (n % 2 == 0L || n % 3 == 0L) return false
    var i = 5L
    while (i * i <= n) {
        if (n % i == 0L || n % (i + 2) == 0L) return false
        i += 6
    }
    return true
}

fun rho(n: Long): Long {
    if (n % 2 == 0L) return 2
    var x = 2L; var y = 2L; val c = 1L; var d = 1L
    while (d == 1L) {
        x = (x * x + c) % n
        y = (y * y + c) % n
        y = (y * y + c) % n
        d = gcd(abs(x - y), n)
    }
    return if (d != n) d else n
}

fun pollardsRho(n: Long): Long {
    if (n <= 1) return n
    if (isPrime(n)) return n
    var smallest = n
    val stack = mutableListOf(n)
    while (stack.isNotEmpty()) {
        val num = stack.removeAt(stack.size - 1)
        if (num <= 1) continue
        if (isPrime(num)) { smallest = min(smallest, num); continue }
        val d = rho(num)
        stack.add(d)
        stack.add(num / d)
    }
    return smallest
}

fun main() {
    println(pollardsRho(15))
    println(pollardsRho(13))
    println(pollardsRho(91))
    println(pollardsRho(221))
}

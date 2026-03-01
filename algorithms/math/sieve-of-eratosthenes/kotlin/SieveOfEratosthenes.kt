fun sieveOfEratosthenes(n: Int): List<Int> {
    if (n < 2) return emptyList()

    val isPrime = BooleanArray(n + 1) { it >= 2 }

    var i = 2
    while (i * i <= n) {
        if (isPrime[i]) {
            var j = i * i
            while (j <= n) {
                isPrime[j] = false
                j += i
            }
        }
        i++
    }

    return (2..n).filter { isPrime[it] }
}

fun main() {
    println("Primes up to 30: ${sieveOfEratosthenes(30)}")
}

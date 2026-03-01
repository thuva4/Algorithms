fun eulerTotientSieve(n: Int): Long {
    val phi = IntArray(n + 1) { it }
    for (i in 2..n) {
        if (phi[i] == i) {
            var j = i
            while (j <= n) {
                phi[j] -= phi[j] / i
                j += i
            }
        }
    }
    return phi.drop(1).sumOf { it.toLong() }
}

fun main() {
    println(eulerTotientSieve(1))
    println(eulerTotientSieve(10))
    println(eulerTotientSieve(100))
}

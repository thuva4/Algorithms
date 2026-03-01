fun modPow(base: Long, exp: Long, mod: Long): Long {
    var result = 1L
    var b = base % mod
    var e = exp
    while (e > 0) {
        if (e and 1L == 1L)
            result = (result * b) % mod
        e = e shr 1
        b = (b * b) % mod
    }
    return result
}

fun main() {
    val p = 23L
    val g = 5L
    val a = 6L
    val b = 15L

    val publicA = modPow(g, a, p)
    println("Alice sends: $publicA")

    val publicB = modPow(g, b, p)
    println("Bob sends: $publicB")

    val aliceSecret = modPow(publicB, a, p)
    println("Alice's shared secret: $aliceSecret")

    val bobSecret = modPow(publicA, b, p)
    println("Bob's shared secret: $bobSecret")
}

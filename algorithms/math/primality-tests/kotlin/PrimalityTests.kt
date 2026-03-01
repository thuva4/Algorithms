fun isPrime(n: Int): Boolean {
    if (n < 2) {
        return false
    }
    if (n == 2 || n == 3) {
        return true
    }
    if (n % 2 == 0 || n % 3 == 0) {
        return false
    }

    var factor = 5
    while (factor.toLong() * factor <= n.toLong()) {
        if (n % factor == 0 || n % (factor + 2) == 0) {
            return false
        }
        factor += 6
    }

    return true
}

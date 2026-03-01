fun eulerTotient(n: Int): Int {
    if (n <= 1) {
        return 1
    }

    var value = n
    var result = n
    var factor = 2

    while (factor * factor <= value) {
        if (value % factor == 0) {
            while (value % factor == 0) {
                value /= factor
            }
            result -= result / factor
        }
        factor++
    }

    if (value > 1) {
        result -= result / value
    }

    return result
}

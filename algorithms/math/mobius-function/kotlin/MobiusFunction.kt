fun mobiusFunction(n: Int): Int {
    fun mobiusValue(x: Int): Int {
        var remaining = x
        var distinctPrimeFactors = 0
        var factor = 2

        while (factor * factor <= remaining) {
            if (remaining % factor == 0) {
                remaining /= factor
                if (remaining % factor == 0) {
                    return 0
                }
                distinctPrimeFactors++
                while (remaining % factor == 0) {
                    remaining /= factor
                }
            }
            factor++
        }

        if (remaining > 1) {
            distinctPrimeFactors++
        }

        return if (distinctPrimeFactors % 2 == 0) 1 else -1
    }

    var total = 0
    for (value in 1..n) {
        total += mobiusValue(value)
    }
    return total
}

fun main() {
    println(mobiusFunction(1))
    println(mobiusFunction(10))
    println(mobiusFunction(50))
}

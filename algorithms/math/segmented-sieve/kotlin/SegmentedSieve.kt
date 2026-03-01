fun segmentedSieve(low: Int, high: Int): IntArray {
    if (high < 2 || low > high) {
        return intArrayOf()
    }

    val limit = kotlin.math.sqrt(high.toDouble()).toInt()
    val isPrimeBase = BooleanArray(limit + 1) { true }
    val primes = mutableListOf<Int>()

    for (value in 2..limit) {
        if (isPrimeBase[value]) {
            primes.add(value)
            var multiple = value * value
            while (multiple <= limit) {
                isPrimeBase[multiple] = false
                multiple += value
            }
        }
    }

    val start = maxOf(2, low)
    val isPrimeSegment = BooleanArray(high - start + 1) { true }

    for (prime in primes) {
        var multiple = maxOf(prime * prime, ((start + prime - 1) / prime) * prime)
        while (multiple <= high) {
            isPrimeSegment[multiple - start] = false
            multiple += prime
        }
    }

    val result = mutableListOf<Int>()
    for (offset in isPrimeSegment.indices) {
        if (isPrimeSegment[offset]) {
            result.add(start + offset)
        }
    }

    return result.toIntArray()
}

func segmentedSieve(_ low: Int, _ high: Int) -> [Int] {
    if high < 2 || low > high { return [] }

    let start = max(2, low)
    let limit = Int(Double(high).squareRoot())
    var isPrimeSmall = [Bool](repeating: true, count: max(2, limit + 1))
    var primes: [Int] = []

    if limit >= 2 {
        for value in 2...limit {
            if isPrimeSmall[value] {
                primes.append(value)
                var multiple = value * value
                while multiple <= limit {
                    isPrimeSmall[multiple] = false
                    multiple += value
                }
            }
        }
    }

    var isPrimeRange = [Bool](repeating: true, count: high - start + 1)
    for prime in primes {
        var multiple = max(prime * prime, ((start + prime - 1) / prime) * prime)
        while multiple <= high {
            isPrimeRange[multiple - start] = false
            multiple += prime
        }
    }

    var result: [Int] = []
    for value in start...high {
        if isPrimeRange[value - start] {
            result.append(value)
        }
    }
    return result
}

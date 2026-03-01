func sieveOfEratosthenes(_ n: Int) -> [Int] {
    if n < 2 { return [] }

    var isPrime = [Bool](repeating: true, count: n + 1)
    isPrime[0] = false
    isPrime[1] = false

    var i = 2
    while i * i <= n {
        if isPrime[i] {
            var j = i * i
            while j <= n {
                isPrime[j] = false
                j += i
            }
        }
        i += 1
    }

    return (2...n).filter { isPrime[$0] }
}

print("Primes up to 30: \(sieveOfEratosthenes(30))")

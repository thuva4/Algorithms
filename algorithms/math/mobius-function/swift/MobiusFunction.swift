func mobiusFunction(_ n: Int) -> Int {
    if n <= 0 { return 0 }

    var mu = [Int](repeating: 1, count: n + 1)
    var isPrime = [Bool](repeating: true, count: n + 1)
    if n >= 0 { isPrime[0] = false }
    if n >= 1 { isPrime[1] = false }

    if n >= 2 {
        for i in 2...n {
            if isPrime[i] {
                var j = i
                while j <= n {
                    if j != i { isPrime[j] = false }
                    mu[j] = -mu[j]
                    j += i
                }
                let i2 = i * i
                if i2 <= n {
                    j = i2
                    while j <= n {
                        mu[j] = 0
                        j += i2
                    }
                }
            }
        }
    }
    return mu[1...n].reduce(0, +)
}

print(mobiusFunction(1))
print(mobiusFunction(10))
print(mobiusFunction(50))

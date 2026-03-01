func eulerTotientSieve(_ n: Int) -> Int {
    var phi = Array(0...n)
    if n >= 2 {
        for i in 2...n {
            if phi[i] == i {
                var j = i
                while j <= n {
                    phi[j] -= phi[j] / i
                    j += i
                }
            }
        }
    }
    return phi[1...n].reduce(0, +)
}

print(eulerTotientSieve(1))
print(eulerTotientSieve(10))
print(eulerTotientSieve(100))

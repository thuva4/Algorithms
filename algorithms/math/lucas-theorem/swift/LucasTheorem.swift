func modPowLT(_ base: Int, _ exp: Int, _ mod: Int) -> Int {
    var b = base % mod, e = exp, result = 1
    while e > 0 {
        if e & 1 == 1 { result = result * b % mod }
        e >>= 1; b = b * b % mod
    }
    return result
}

func lucasTheorem(_ n: Int, _ k: Int, _ p: Int) -> Int {
    if k > n { return 0 }
    var fact = [Int](repeating: 1, count: p)
    for i in 1..<p { fact[i] = fact[i - 1] * i % p }

    var result = 1, nn = n, kk = k
    while nn > 0 || kk > 0 {
        let ni = nn % p, ki = kk % p
        if ki > ni { return 0 }
        let c = fact[ni] * modPowLT(fact[ki], p - 2, p) % p * modPowLT(fact[ni - ki], p - 2, p) % p
        result = result * c % p
        nn /= p; kk /= p
    }
    return result
}

print(lucasTheorem(10, 3, 7))
print(lucasTheorem(5, 2, 3))
print(lucasTheorem(100, 50, 13))

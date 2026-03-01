func catalanNumbers(_ n: Int) -> Int {
    let MOD: Int64 = 1000000007

    func modPow(_ base: Int64, _ exp: Int64, _ mod: Int64) -> Int64 {
        var result: Int64 = 1
        var b = base % mod
        var e = exp
        while e > 0 {
            if e % 2 == 1 { result = result * b % mod }
            e /= 2
            b = b * b % mod
        }
        return result
    }

    func modInv(_ a: Int64, _ mod: Int64) -> Int64 {
        return modPow(a, mod - 2, mod)
    }

    var result: Int64 = 1
    for i in 1...max(1, n) {
        if n == 0 { break }
        result = result * Int64(2 * (2 * i - 1)) % MOD
        result = result * modInv(Int64(i + 1), MOD) % MOD
    }

    return Int(result)
}

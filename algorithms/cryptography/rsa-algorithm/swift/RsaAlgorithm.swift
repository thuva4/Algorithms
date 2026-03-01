func modPowRSA(_ base: Int, _ exp: Int, _ mod: Int) -> Int {
    var b = base % mod, e = exp, result = 1
    while e > 0 {
        if e & 1 == 1 { result = result * b % mod }
        e >>= 1; b = b * b % mod
    }
    return result
}

func extGcd(_ a: Int, _ b: Int) -> (Int, Int, Int) {
    if a == 0 { return (b, 0, 1) }
    let (g, x1, y1) = extGcd(b % a, a)
    return (g, y1 - (b / a) * x1, x1)
}

func modInverse(_ e: Int, _ phi: Int) -> Int {
    let (_, x, _) = extGcd(e % phi, phi)
    return ((x % phi) + phi) % phi
}

func rsaAlgorithm(_ p: Int, _ q: Int, _ e: Int, _ message: Int) -> Int {
    let n = p * q
    let phi = (p - 1) * (q - 1)
    let d = modInverse(e, phi)
    let cipher = modPowRSA(message, e, n)
    return modPowRSA(cipher, d, n)
}

print(rsaAlgorithm(61, 53, 17, 65))
print(rsaAlgorithm(61, 53, 17, 42))
print(rsaAlgorithm(11, 13, 7, 9))

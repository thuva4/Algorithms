func millerRabin(_ n: Int) -> Int {
    if n < 2 { return 0 }
    if n < 4 { return 1 }
    if n % 2 == 0 { return 0 }

    func modPow(_ base: Int, _ exp: Int, _ mod: Int) -> Int {
        var result = 1
        var b = base % mod
        var e = exp
        while e > 0 {
            if e % 2 == 1 { result = result * b % mod }
            e /= 2
            b = b * b % mod
        }
        return result
    }

    var r = 0
    var d = n - 1
    while d % 2 == 0 { r += 1; d /= 2 }

    let witnesses = [2, 3, 5, 7]
    for a in witnesses {
        if a >= n { continue }

        var x = modPow(a, d, n)
        if x == 1 || x == n - 1 { continue }

        var found = false
        for _ in 0..<(r - 1) {
            x = modPow(x, 2, n)
            if x == n - 1 { found = true; break }
        }

        if !found { return 0 }
    }

    return 1
}

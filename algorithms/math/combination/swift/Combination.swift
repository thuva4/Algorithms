func nCr(_ n: Int, _ r: Int) -> Int {
    if r < 0 || r > n { return 0 }
    if r == 0 || r == n { return 1 }

    let k = min(r, n - r)
    var result = 1
    if k == 0 { return 1 }

    for i in 1...k {
        result = result * (n - k + i) / i
    }

    return result
}

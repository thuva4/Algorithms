func extGcd(_ a: Int, _ b: Int) -> (Int, Int, Int) {
    if a == 0 { return (b, 0, 1) }
    let (g, x1, y1) = extGcd(b % a, a)
    return (g, y1 - (b / a) * x1, x1)
}

func chineseRemainder(_ arr: [Int]) -> Int {
    let n = arr[0]
    var r = arr[1]
    var m = arr[2]

    for i in 1..<n {
        let r2 = arr[1 + 2 * i]
        let m2 = arr[2 + 2 * i]
        let (g, p, _) = extGcd(m, m2)
        let lcm = m / g * m2
        r = (r + m * ((r2 - r) / g) * p) % lcm
        if r < 0 { r += lcm }
        m = lcm
    }

    return r % m
}

func extendedGcd(_ a: Int, _ b: Int) -> [Int] {
    if a == b {
        return [abs(a), 1, 0]
    }
    if a == 0 {
        return [abs(b), 0, b >= 0 ? 1 : -1]
    }

    let next = extendedGcd(b % a, a)
    let gcd = next[0]
    let x1 = next[1]
    let y1 = next[2]
    let x = y1 - (b / a) * x1
    let y = x1
    return [gcd, x, y]
}

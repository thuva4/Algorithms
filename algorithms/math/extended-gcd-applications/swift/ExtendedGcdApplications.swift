func extGcd(_ a: Int, _ b: Int) -> (Int, Int, Int) {
    if a == 0 { return (b, 0, 1) }
    let (g, x1, y1) = extGcd(b % a, a)
    return (g, y1 - (b / a) * x1, x1)
}

func extendedGcdApplications(_ arr: [Int]) -> Int {
    let a = arr[0], m = arr[1]
    let (g, x, _) = extGcd(((a % m) + m) % m, m)
    if g != 1 { return -1 }
    return ((x % m) + m) % m
}

print(extendedGcdApplications([3, 7]))
print(extendedGcdApplications([1, 13]))
print(extendedGcdApplications([6, 9]))
print(extendedGcdApplications([2, 11]))

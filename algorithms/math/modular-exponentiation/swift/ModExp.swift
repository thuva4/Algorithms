func modExp(_ arr: [Int]) -> Int {
    var base = arr[0]
    var exp = arr[1]
    let mod = arr[2]
    if mod == 1 { return 0 }
    var result = 1
    base = base % mod
    while exp > 0 {
        if exp % 2 == 1 {
            result = (result * base) % mod
        }
        exp >>= 1
        base = (base * base) % mod
    }
    return result
}

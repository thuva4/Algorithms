func countSetBits(_ arr: [Int]) -> Int {
    var total = 0
    for num in arr {
        var n = num
        while n != 0 {
            total += 1
            n &= (n - 1)
        }
    }
    return total
}

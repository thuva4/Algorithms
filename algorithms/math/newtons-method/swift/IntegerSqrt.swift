func integerSqrt(_ arr: [Int]) -> Int {
    let n = arr[0]
    if n <= 1 { return n }
    var x = n
    while true {
        let x1 = (x + n / x) / 2
        if x1 >= x { return x }
        x = x1
    }
}

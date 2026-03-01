func planarityTesting(_ arr: [Int]) -> Int {
    let n = arr[0]; let m = arr[1]
    var edges = Set<Int>()
    for i in 0..<m {
        let u = arr[2+2*i], v = arr[2+2*i+1]
        if u != v {
            let a = min(u, v), b = max(u, v)
            edges.insert(a * n + b)
        }
    }
    let e = edges.count
    if n < 3 { return 1 }
    return e <= 3 * n - 6 ? 1 : 0
}

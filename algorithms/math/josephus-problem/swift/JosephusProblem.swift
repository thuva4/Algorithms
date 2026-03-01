func josephus(_ n: Int, _ k: Int) -> Int {
    if n <= 0 || k <= 0 { return 0 }
    var result = 0
    if n == 1 { return 0 }
    for size in 2...n {
        result = (result + k) % size
    }
    return result
}

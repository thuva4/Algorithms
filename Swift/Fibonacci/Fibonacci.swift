//Recursive algorithm
func fibonacci(_ n: Int) -> Int {
    guard n != 0, n != 1 else { return n }
    return fibonacci(n - 1) + fibonacci(n - 2)
}

fun fibonacci(n: Int): Int {
    if (n <= 0) return 0
    if (n == 1) return 1

    var prev = 0
    var curr = 1
    repeat(n - 1) {
        val next = prev + curr
        prev = curr
        curr = next
    }
    return curr
}

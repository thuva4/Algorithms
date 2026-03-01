func factorial(_ n: Int) -> Int {
    var result = 1
    for i in 2...max(n, 2) {
        if i > n { break }
        result *= i
    }
    return result
}

print("5! = \(factorial(5))")
print("10! = \(factorial(10))")
print("0! = \(factorial(0))")

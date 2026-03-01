fun factorial(n: Int): Long {
    var result: Long = 1
    for (i in 2..n) {
        result *= i
    }
    return result
}

fun main() {
    println("5! = ${factorial(5)}")
    println("10! = ${factorial(10)}")
    println("0! = ${factorial(0)}")
}

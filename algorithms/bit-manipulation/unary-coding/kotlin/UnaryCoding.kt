fun unaryEncode(n: Int): String {
    return "1".repeat(n) + "0"
}

fun main() {
    println("Unary encoding of 0: ${unaryEncode(0)}")
    println("Unary encoding of 3: ${unaryEncode(3)}")
    println("Unary encoding of 5: ${unaryEncode(5)}")
}

fun xorSwap(a: Int, b: Int): Pair<Int, Int> {
    var x = a
    var y = b
    if (x != y) {
        x = x xor y
        y = x xor y
        x = x xor y
    }
    return Pair(x, y)
}

fun main() {
    val (a, b) = xorSwap(5, 10)
    println("After swap: a=$a, b=$b")
}

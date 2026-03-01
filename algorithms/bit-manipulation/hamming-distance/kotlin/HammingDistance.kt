fun hammingDistance(a: Int, b: Int): Int {
    return Integer.bitCount(a xor b)
}

fun main() {
    println("Hamming distance between 1 and 4: ${hammingDistance(1, 4)}")
    println("Hamming distance between 7 and 8: ${hammingDistance(7, 8)}")
    println("Hamming distance between 93 and 73: ${hammingDistance(93, 73)}")
}

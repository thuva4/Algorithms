object HammingDistance {
  def hammingDistance(a: Int, b: Int): Int = {
    Integer.bitCount(a ^ b)
  }

  def main(args: Array[String]): Unit = {
    println(s"Hamming distance between 1 and 4: ${hammingDistance(1, 4)}")
    println(s"Hamming distance between 7 and 8: ${hammingDistance(7, 8)}")
    println(s"Hamming distance between 93 and 73: ${hammingDistance(93, 73)}")
  }
}

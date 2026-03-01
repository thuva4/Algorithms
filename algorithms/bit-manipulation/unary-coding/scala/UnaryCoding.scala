object UnaryCoding {
  def unaryEncode(n: Int): String = {
    "1" * n + "0"
  }

  def main(args: Array[String]): Unit = {
    println(s"Unary encoding of 0: ${unaryEncode(0)}")
    println(s"Unary encoding of 3: ${unaryEncode(3)}")
    println(s"Unary encoding of 5: ${unaryEncode(5)}")
  }
}

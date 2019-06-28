object XorSwap {

  def swap( x: Int,  y: Int) = {
    var xx = x ^ y
    var yy = xx ^ y
    xx = xx ^ yy
    (xx, yy)
  }

  def main(args: Array[String]): Unit = {
    println(swap(10,6))
  }
}
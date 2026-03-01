object Swap {

  def swap(x: Int, y: Int) = {
    (y,x)
  }

  def main(args: Array[String]): Unit = {
    var (x, y) = (10,6)
    var swapped = swap(x,y)
    x = swapped._1
    y = swapped._2
    println(x, y)
  }

}



object Kadane {

  def kadane(arr: Array[Int]): Int = {
    var maxSoFar = arr(0)
    var maxEndingHere = arr(0)

    for (i <- 1 until arr.length) {
      maxEndingHere = math.max(arr(i), maxEndingHere + arr(i))
      maxSoFar = math.max(maxSoFar, maxEndingHere)
    }

    maxSoFar
  }

  def main(args: Array[String]): Unit = {
    println(kadane(Array(-2, 1, -3, 4, -1, 2, 1, -5, 4))) // 6
  }
}

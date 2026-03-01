object RangeTree {
  def rangeTree(data: Array[Int]): Int = {
    val n = data(0)
    val points = data.slice(1, 1 + n).sorted
    val lo = data(1 + n); val hi = data(2 + n)
    points.count(p => p >= lo && p <= hi)
  }

  def main(args: Array[String]): Unit = {
    println(rangeTree(Array(5, 1, 3, 5, 7, 9, 2, 6)))
    println(rangeTree(Array(4, 2, 4, 6, 8, 1, 10)))
    println(rangeTree(Array(3, 1, 2, 3, 10, 20)))
  }
}

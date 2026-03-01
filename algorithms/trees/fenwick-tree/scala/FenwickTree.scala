class FenwickTree(arr: Array[Int]) {
  private val n: Int = arr.length
  private val tree: Array[Int] = new Array[Int](n + 1)

  for (i <- arr.indices) update(i, arr(i))

  def update(idx: Int, delta: Int): Unit = {
    var i = idx + 1
    while (i <= n) {
      tree(i) += delta
      i += i & (-i)
    }
  }

  def query(idx: Int): Int = {
    var sum = 0
    var i = idx + 1
    while (i > 0) {
      sum += tree(i)
      i -= i & (-i)
    }
    sum
  }
}

object FenwickTreeApp {
  def main(args: Array[String]): Unit = {
    val arr = Array(1, 2, 3, 4, 5)
    val ft = new FenwickTree(arr)
    println(s"Sum of first 4 elements: ${ft.query(3)}")

    ft.update(2, 5)
    println(s"After update, sum of first 4 elements: ${ft.query(3)}")
  }
}

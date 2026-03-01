object FractionalKnapsack {

  def fractionalKnapsack(arr: Array[Int]): Int = {
    val capacity = arr(0); val n = arr(1)
    val items = new Array[(Int, Int)](n)
    var idx = 2
    for (i <- 0 until n) { items(i) = (arr(idx), arr(idx + 1)); idx += 2 }
    val sorted = items.sortBy(x => -x._1.toDouble / x._2)

    var totalValue = 0.0; var remaining = capacity
    for ((value, weight) <- sorted if remaining > 0) {
      if (weight <= remaining) { totalValue += value; remaining -= weight }
      else { totalValue += value.toDouble * remaining / weight; remaining = 0 }
    }
    (totalValue * 100).toInt
  }
}

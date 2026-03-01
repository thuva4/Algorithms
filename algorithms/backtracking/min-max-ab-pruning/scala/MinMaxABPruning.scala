object MinMaxABPruning {
  def minimaxAB(depth: Int, nodeIndex: Int, isMax: Boolean, scores: Array[Int], h: Int, alpha: Int, beta: Int): Int = {
    if (depth == h) return scores(nodeIndex)

    var a = alpha
    var b = beta

    if (isMax) {
      var bestVal = Int.MinValue
      for (childIndex <- Array(nodeIndex * 2, nodeIndex * 2 + 1)) {
        val childValue = minimaxAB(depth + 1, childIndex, false, scores, h, a, b)
        bestVal = math.max(bestVal, childValue)
        a = math.max(a, bestVal)
        if (b <= a) return bestVal
      }
      bestVal
    } else {
      var bestVal = Int.MaxValue
      for (childIndex <- Array(nodeIndex * 2, nodeIndex * 2 + 1)) {
        val childValue = minimaxAB(depth + 1, childIndex, true, scores, h, a, b)
        bestVal = math.min(bestVal, childValue)
        b = math.min(b, bestVal)
        if (b <= a) return bestVal
      }
      bestVal
    }
  }

  def main(args: Array[String]): Unit = {
    val scores = Array(3, 5, 2, 9, 12, 5, 23, 23)
    val h = (math.log(scores.length) / math.log(2)).toInt
    val result = minimaxAB(0, 0, isMax = true, scores, h, Int.MinValue, Int.MaxValue)
    println(s"The optimal value is: $result")
  }
}

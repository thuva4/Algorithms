object Minimax {
  def minimax(depth: Int, nodeIndex: Int, isMax: Boolean, scores: Array[Int], h: Int): Int = {
    if (depth == h) return scores(nodeIndex)

    if (isMax)
      math.max(
        minimax(depth + 1, nodeIndex * 2, false, scores, h),
        minimax(depth + 1, nodeIndex * 2 + 1, false, scores, h))
    else
      math.min(
        minimax(depth + 1, nodeIndex * 2, true, scores, h),
        minimax(depth + 1, nodeIndex * 2 + 1, true, scores, h))
  }

  def main(args: Array[String]): Unit = {
    val scores = Array(3, 5, 2, 9, 12, 5, 23, 23)
    val h = (math.log(scores.length) / math.log(2)).toInt
    val result = minimax(0, 0, isMax = true, scores, h)
    println(s"The optimal value is: $result")
  }
}

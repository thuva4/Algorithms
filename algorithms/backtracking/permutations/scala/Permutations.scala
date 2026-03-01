object Permutations {
  def permutations(arr: List[Int]): List[List[Int]] = {
    if (arr.isEmpty) return List(List.empty[Int])

    def backtrack(current: List[Int], remaining: List[Int]): List[List[Int]] = {
      if (remaining.isEmpty) return List(current)
      remaining.indices.flatMap { i =>
        val elem = remaining(i)
        val newRemaining = remaining.take(i) ++ remaining.drop(i + 1)
        backtrack(current :+ elem, newRemaining)
      }.toList
    }

    backtrack(List.empty, arr).sortBy(_.mkString(","))
  }

  def main(args: Array[String]): Unit = {
    val result = permutations(List(1, 2, 3))
    result.foreach(println)
  }
}

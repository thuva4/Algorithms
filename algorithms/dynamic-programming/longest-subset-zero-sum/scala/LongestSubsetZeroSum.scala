import scala.collection.mutable

object LongestSubsetZeroSum {

  def longestSubsetZeroSum(arr: Array[Int]): Int = {
    var maxLen = 0
    val sumMap = mutable.Map[Int, Int](0 -> -1)
    var sum = 0

    for (i <- arr.indices) {
      sum += arr(i)
      sumMap.get(sum) match {
        case Some(idx) =>
          maxLen = math.max(maxLen, i - idx)
        case None =>
          sumMap(sum) = i
      }
    }

    maxLen
  }

  def main(args: Array[String]): Unit = {
    println(longestSubsetZeroSum(Array(1, 2, -3, 3))) // 3
  }
}

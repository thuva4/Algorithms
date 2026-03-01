package algorithms.sorting.bucket

import scala.collection.mutable.ListBuffer

/**
 * Bucket Sort implementation.
 * Divides the input into several buckets, each of which is then sorted individually.
 */
object BucketSort {
  def sort(arr: Array[Int]): Array[Int] = {
    if (arr.length <= 1) {
      return arr.clone()
    }

    val n = arr.length
    val minVal = arr.min
    val maxVal = arr.max

    if (minVal == maxVal) {
      return arr.clone()
    }

    // Initialize buckets
    val buckets = Array.fill(n)(ListBuffer.empty[Int])
    val range = maxVal.toLong - minVal

    // Distribute elements into buckets
    for (x <- arr) {
      val index = ((x.toLong - minVal) * (n - 1) / range).toInt
      buckets(index) += x
    }

    // Sort each bucket and merge
    val result = new Array[Int](n)
    var k = 0
    for (bucket <- buckets) {
      if (bucket.nonEmpty) {
        val sortedBucket = bucket.sorted
        for (x <- sortedBucket) {
          result(k) = x
          k += 1
        }
      }
    }

    result
  }
}

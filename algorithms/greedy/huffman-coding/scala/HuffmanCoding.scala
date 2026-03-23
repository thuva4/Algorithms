import scala.collection.mutable

object HuffmanCoding {

  def huffmanCoding(frequencies: Array[Int]): Int = {
    if (frequencies.length <= 1) return 0

    val minHeap = mutable.PriorityQueue.empty[Int](using Ordering.Int.reverse)
    frequencies.foreach(minHeap.enqueue(_))

    var totalCost = 0
    while (minHeap.size > 1) {
      val left = minHeap.dequeue()
      val right = minHeap.dequeue()
      val merged = left + right
      totalCost += merged
      minHeap.enqueue(merged)
    }

    totalCost
  }
}

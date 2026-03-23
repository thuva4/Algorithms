import scala.collection.mutable
import scala.collection.mutable.ArrayBuffer

object FibonacciHeap {
  def fibonacciHeap(operations: Array[Int]): Array[Int] = {
    val heap = mutable.PriorityQueue.empty[Int](using Ordering.Int.reverse)
    val results = ArrayBuffer[Int]()
    for (op <- operations) {
      if (op == 0) {
        if (heap.isEmpty) results += -1
        else results += heap.dequeue()
      } else {
        heap.enqueue(op)
      }
    }
    results.toArray
  }

  def main(args: Array[String]): Unit = {
    println(fibonacciHeap(Array(3, 1, 4, 0, 0)).mkString(", "))
    println(fibonacciHeap(Array(5, 2, 8, 1, 0, 0, 0, 0)).mkString(", "))
  }
}

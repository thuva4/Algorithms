package algorithms.graph.astarbidirectional

import scala.collection.mutable
import scala.math.{abs, min}

object AStarBidirectional {
  case class Node(r: Int, c: Int, f: Int, g: Int) extends Ordered[Node] {
    def compare(that: Node): Int = that.f - this.f // Min-heap via max-heap logic or use reverse
  }

  def solve(arr: Array[Int]): Int = {
    if (arr.length < 7) return -1

    val rows = arr(0)
    val cols = arr(1)
    val sr = arr(2); val sc = arr(3)
    val er = arr(4); val ec = arr(5)
    val numObs = arr(6)

    if (arr.length < 7 + 2 * numObs) return -1

    if (sr < 0 || sr >= rows || sc < 0 || sc >= cols || er < 0 || er >= rows || ec < 0 || ec >= cols) return -1
    if (sr == er && sc == ec) return 0

    val grid = Array.ofDim[Boolean](rows, cols)
    for (i <- 0 until numObs) {
      val r = arr(7 + 2 * i)
      val c = arr(7 + 2 * i + 1)
      if (r >= 0 && r < rows && c >= 0 && c < cols) {
        grid(r)(c) = true
      }
    }

    if (grid(sr)(sc) || grid(er)(ec)) return -1

    val openF = mutable.PriorityQueue.empty[Node]
    val openB = mutable.PriorityQueue.empty[Node]

    val gF = Array.fill(rows, cols)(Int.MaxValue)
    val gB = Array.fill(rows, cols)(Int.MaxValue)

    val hStart = abs(sr - er) + abs(sc - ec)
    gF(sr)(sc) = 0
    openF.enqueue(Node(sr, sc, hStart, 0))

    val hEnd = abs(er - sr) + abs(ec - sc)
    gB(er)(ec) = 0
    openB.enqueue(Node(er, ec, hEnd, 0))

    var bestPath = Int.MaxValue
    val dr = Array(-1, 1, 0, 0)
    val dc = Array(0, 0, -1, 1)

    while (openF.nonEmpty && openB.nonEmpty) {
      if (openF.nonEmpty) {
        val u = openF.dequeue()
        if (u.g <= gF(u.r)(u.c)) {
          for (i <- 0 until 4) {
            val nr = u.r + dr(i)
            val nc = u.c + dc(i)

            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !grid(nr)(nc)) {
              val newG = u.g + 1
              if (newG < gF(nr)(nc)) {
                gF(nr)(nc) = newG
                val h = abs(nr - er) + abs(nc - ec)
                openF.enqueue(Node(nr, nc, newG + h, newG))

                if (gB(nr)(nc) != Int.MaxValue) {
                  bestPath = min(bestPath, newG + gB(nr)(nc))
                }
              }
            }
          }
        }
      }

      if (openB.nonEmpty) {
        val u = openB.dequeue()
        if (u.g <= gB(u.r)(u.c)) {
          for (i <- 0 until 4) {
            val nr = u.r + dr(i)
            val nc = u.c + dc(i)

            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !grid(nr)(nc)) {
              val newG = u.g + 1
              if (newG < gB(nr)(nc)) {
                gB(nr)(nc) = newG
                val h = abs(nr - sr) + abs(nc - sc)
                openB.enqueue(Node(nr, nc, newG + h, newG))

                if (gF(nr)(nc) != Int.MaxValue) {
                  bestPath = min(bestPath, newG + gF(nr)(nc))
                }
              }
            }
          }
        }
      }

      val minF = if (openF.nonEmpty) openF.head.f else Int.MaxValue
      val minB = if (openB.nonEmpty) openB.head.f else Int.MaxValue

      if (bestPath != Int.MaxValue && minF.toLong + minB >= bestPath) return bestPath
    }

    if (bestPath == Int.MaxValue) -1 else bestPath
  }
}

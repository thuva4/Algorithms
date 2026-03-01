package algorithms.graph.dinic

import java.util.LinkedList
import java.util.Queue
import scala.collection.mutable.ArrayBuffer
import scala.math.min

object Dinic {
  case class Edge(to: Int, rev: Int, cap: Long, var flow: Long)

  def solve(arr: Array[Int]): Int = {
    if (arr.length < 4) return 0
    val n = arr(0)
    val m = arr(1)
    val s = arr(2)
    val t = arr(3)

    if (arr.length < 4 + 3 * m) return 0

    val adj = Array.fill(n)(new ArrayBuffer[Edge])
    for (i <- 0 until m) {
      val u = arr(4 + 3 * i)
      val v = arr(4 + 3 * i + 1)
      val cap = arr(4 + 3 * i + 2).toLong
      if (u >= 0 && u < n && v >= 0 && v < n) {
        val a = Edge(v, adj(v).length, cap, 0)
        val b = Edge(u, adj(u).length, 0, 0)
        adj(u).append(a)
        adj(v).append(b)
      }
    }

    val level = new Array[Int](n)
    val ptr = new Array[Int](n)

    def bfs(): Boolean = {
      java.util.Arrays.fill(level, -1)
      level(s) = 0
      val q: Queue[Int] = new LinkedList()
      q.add(s)

      while (!q.isEmpty) {
        val u = q.poll()
        for (e <- adj(u)) {
          if (e.cap - e.flow > 0 && level(e.to) == -1) {
            level(e.to) = level(u) + 1
            q.add(e.to)
          }
        }
      }
      level(t) != -1
    }

    def dfs(u: Int, pushed: Long): Long = {
      if (pushed == 0) return 0
      if (u == t) return pushed

      while (ptr(u) < adj(u).length) {
        val id = ptr(u)
        val e = adj(u)(id)
        val v = e.to

        if (level(u) + 1 != level(v) || e.cap - e.flow == 0) {
          ptr(u) += 1
        } else {
          val tr = pushed
          val actualPushed = if (e.cap - e.flow < tr) e.cap - e.flow else tr
          
          val pushedFlow = dfs(v, actualPushed)
          if (pushedFlow == 0) {
            ptr(u) += 1
          } else {
            e.flow += pushedFlow
            adj(v)(e.rev).flow -= pushedFlow
            return pushedFlow
          }
        }
      }
      0
    }

    var flow: Long = 0
    while (bfs()) {
      java.util.Arrays.fill(ptr, 0)
      var pushed: Long = 0
      do {
        pushed = dfs(s, Long.MaxValue)
        flow += pushed
      } while (pushed != 0)
    }

    flow.toInt
  }
}

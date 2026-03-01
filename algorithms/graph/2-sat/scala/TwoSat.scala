package algorithms.graph.twosat

import scala.collection.mutable
import scala.math.{abs, min}

object TwoSat {
  def solve(arr: Array[Int]): Int = {
    if (arr.length < 2) return 0
    val n = arr(0)
    val m = arr(1)

    if (arr.length < 2 + 2 * m) return 0

    val numNodes = 2 * n
    val adj = Array.fill(numNodes)(new mutable.ListBuffer[Int])

    for (i <- 0 until m) {
      val uRaw = arr(2 + 2 * i)
      val vRaw = arr(2 + 2 * i + 1)

      val u = (abs(uRaw) - 1) * 2 + (if (uRaw < 0) 1 else 0)
      val v = (abs(vRaw) - 1) * 2 + (if (vRaw < 0) 1 else 0)

      val notU = u ^ 1
      val notV = v ^ 1

      adj(notU).append(v)
      adj(notV).append(u)
    }

    val dfn = new Array[Int](numNodes)
    val low = new Array[Int](numNodes)
    val sccId = new Array[Int](numNodes)
    val inStack = new Array[Boolean](numNodes)
    val stack = new mutable.Stack[Int]()
    var timer = 0
    var sccCnt = 0

    def tarjan(u: Int): Unit = {
      timer += 1
      dfn(u) = timer
      low(u) = timer
      stack.push(u)
      inStack(u) = true

      for (v <- adj(u)) {
        if (dfn(v) == 0) {
          tarjan(v)
          low(u) = min(low(u), low(v))
        } else if (inStack(v)) {
          low(u) = min(low(u), dfn(v))
        }
      }

      if (low(u) == dfn(u)) {
        sccCnt += 1
        var v = -1
        do {
          v = stack.pop()
          inStack(v) = false
          sccId(v) = sccCnt
        } while (u != v)
      }
    }

    for (i <- 0 until numNodes) {
      if (dfn(i) == 0) tarjan(i)
    }

    for (i <- 0 until n) {
      if (sccId(2 * i) == sccId(2 * i + 1)) return 0
    }

    1
  }
}

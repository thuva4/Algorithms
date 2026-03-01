object MinimumSpanningArborescence {

  def minimumSpanningArborescence(arr: Array[Int]): Int = {
    var n = arr(0)
    val m = arr(1)
    var root = arr(2)
    var eu = (0 until m).map(i => arr(3 + 3 * i)).toArray
    var ev = (0 until m).map(i => arr(3 + 3 * i + 1)).toArray
    var ew = (0 until m).map(i => arr(3 + 3 * i + 2)).toArray

    val INF = Int.MaxValue / 2
    var res = 0
    var done = false

    while (!done) {
      val minIn = Array.fill(n)(INF)
      val minEdge = Array.fill(n)(-1)

      for (i <- eu.indices) {
        if (eu(i) != ev(i) && ev(i) != root && ew(i) < minIn(ev(i))) {
          minIn(ev(i)) = ew(i)
          minEdge(ev(i)) = eu(i)
        }
      }

      for (i <- 0 until n) {
        if (i != root && minIn(i) == INF) return -1
      }

      val comp = Array.fill(n)(-1)
      comp(root) = root
      var numCycles = 0

      for (i <- 0 until n) {
        if (i != root) res += minIn(i)
      }

      val visited = Array.fill(n)(-1)
      for (i <- 0 until n) {
        if (i != root) {
          var v = i
          while (visited(v) == -1 && comp(v) == -1 && v != root) {
            visited(v) = i
            v = minEdge(v)
          }
          if (v != root && comp(v) == -1 && visited(v) == i) {
            var u = v
            var looping = true
            while (looping) {
              comp(u) = numCycles
              u = minEdge(u)
              if (u == v) looping = false
            }
            numCycles += 1
          }
        }
      }

      if (numCycles == 0) {
        done = true
      } else {
        for (i <- 0 until n) {
          if (comp(i) == -1) {
            comp(i) = numCycles
            numCycles += 1
          }
        }

        val neu = scala.collection.mutable.ArrayBuffer[Int]()
        val nev = scala.collection.mutable.ArrayBuffer[Int]()
        val newW = scala.collection.mutable.ArrayBuffer[Int]()
        for (i <- eu.indices) {
          val nu = comp(eu(i))
          val nv = comp(ev(i))
          if (nu != nv) {
            neu += nu
            nev += nv
            newW += (ew(i) - minIn(ev(i)))
          }
        }

        eu = neu.toArray
        ev = nev.toArray
        ew = newW.toArray
        root = comp(root)
        n = numCycles
      }
    }

    res
  }
}

object SkipList {
  private val MaxLevel = 16
  private val rng = new scala.util.Random(42)

  private class SkipNode(val key: Int, level: Int) {
    val forward = new Array[SkipNode](level + 1)
  }

  def skipList(arr: Array[Int]): Array[Int] = {
    val header = new SkipNode(Int.MinValue, MaxLevel)
    var level = 0

    for (v <- arr) {
      val update = new Array[SkipNode](MaxLevel + 1)
      var current = header
      for (i <- level to 0 by -1) {
        while (current.forward(i) != null && current.forward(i).key < v)
          current = current.forward(i)
        update(i) = current
      }
      val next = current.forward(0)
      if (next != null && next.key == v) {}
      else {
        var newLevel = 0
        while (rng.nextBoolean() && newLevel < MaxLevel) newLevel += 1
        if (newLevel > level) {
          for (i <- level + 1 to newLevel) update(i) = header
          level = newLevel
        }
        val newNode = new SkipNode(v, newLevel)
        for (i <- 0 to newLevel) {
          newNode.forward(i) = update(i).forward(i)
          update(i).forward(i) = newNode
        }
      }
    }

    val result = scala.collection.mutable.ArrayBuffer[Int]()
    var node = header.forward(0)
    while (node != null) {
      result += node.key
      node = node.forward(0)
    }
    result.toArray
  }
}

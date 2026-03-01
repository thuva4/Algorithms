object CycleDetectionFloyd {

  def detectCycle(arr: Array[Int]): Int = {
    val n = arr.length
    if (n == 0) return -1

    def nextPos(pos: Int): Int = {
      if (pos < 0 || pos >= n || arr(pos) == -1) -1
      else arr(pos)
    }

    var tortoise = 0
    var hare = 0

    // Phase 1: Detect cycle
    var found = false
    while (!found) {
      tortoise = nextPos(tortoise)
      if (tortoise == -1) return -1

      hare = nextPos(hare)
      if (hare == -1) return -1
      hare = nextPos(hare)
      if (hare == -1) return -1

      if (tortoise == hare) found = true
    }

    // Phase 2: Find cycle start
    var pointer1 = 0
    var pointer2 = tortoise
    while (pointer1 != pointer2) {
      pointer1 = arr(pointer1)
      pointer2 = arr(pointer2)
    }

    pointer1
  }
}

object StrandSort {
  def sort(arr: Array[Int]): Unit = {
    if (arr.length <= 1) return

    var list = arr.toList
    var sorted = List[Int]()

    while (list.nonEmpty) {
      var strand = List(list.head)
      var remaining = List[Int]()
      
      for (item <- list.tail) {
        if (item >= strand.last) {
          strand = strand :+ item
        } else {
          remaining = remaining :+ item
        }
      }
      
      list = remaining
      sorted = merge(sorted, strand)
    }

    for (i <- arr.indices) {
      arr(i) = sorted(i)
    }
  }

  private def merge(left: List[Int], right: List[Int]): List[Int] = {
    (left, right) match {
      case (Nil, _) => right
      case (_, Nil) => left
      case (l :: ls, r :: rs) =>
        if (l <= r) l :: merge(ls, right)
        else r :: merge(left, rs)
    }
  }
}

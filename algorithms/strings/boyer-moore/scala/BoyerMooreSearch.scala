object BoyerMooreSearch {

  def boyerMooreSearch(arr: Array[Int]): Int = {
    val textLen = arr(0)
    val patLen = arr(1 + textLen)

    if (patLen == 0) return 0
    if (patLen > textLen) return -1

    val text = arr.slice(1, 1 + textLen).toArray
    val pattern = arr.slice(2 + textLen, 2 + textLen + patLen).toArray

    val badChar = scala.collection.mutable.Map[Int, Int]()
    for (i <- pattern.indices) {
      badChar(pattern(i)) = i
    }

    var s = 0
    while (s <= textLen - patLen) {
      var j = patLen - 1
      while (j >= 0 && pattern(j) == text(s + j)) j -= 1
      if (j < 0) return s
      val bc = badChar.getOrElse(text(s + j), -1)
      var shift = j - bc
      if (shift < 1) shift = 1
      s += shift
    }

    -1
  }
}

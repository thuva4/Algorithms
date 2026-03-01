object RunLengthEncoding {
  def runLengthEncoding(arr: Array[Int]): Array[Int] = {
    if (arr.isEmpty) return Array.empty[Int]
    val result = scala.collection.mutable.ArrayBuffer[Int]()
    var count = 1
    for (i <- 1 until arr.length) {
      if (arr(i) == arr(i-1)) count += 1
      else { result += arr(i-1); result += count; count = 1 }
    }
    result += arr.last; result += count
    result.toArray
  }
}

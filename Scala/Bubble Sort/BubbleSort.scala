object BubbleSort {

  def sort (numbers: List[Int]) : List[Int] = {
    var sortedList = numbers
    for (i <- 0 until sortedList.size) {
      for ( j <- 0 until sortedList.size) {
        if (sortedList(i) < sortedList(j)) {
          var temp = sortedList(i)
          sortedList = sortedList.updated(i, sortedList(j))
          sortedList = sortedList.updated(j, temp)
        }
      }
    }
    sortedList
  }

  def main(args: Array[String]): Unit = {
    println(sort(List(8,3,5,6)))
  }

}


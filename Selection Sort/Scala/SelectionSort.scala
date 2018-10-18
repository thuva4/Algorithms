object SelectionSort {

  def sort (numbers: List[Int]) : List[Int] = {
    var sortedList = numbers
    for (i <- 0 until sortedList.size-1) {
      var minimum : Int = i
      for ( j <- 0 until sortedList.size-1) {
        if ( sortedList(j) > sortedList(minimum)) {
          minimum = j
        }
        if (i != minimum) {
          var temp = sortedList(i)
          sortedList = sortedList.updated(i, sortedList(minimum))
          sortedList = sortedList.updated(minimum, temp)
        }
      }
    }
    sortedList
  }

  def main(args: Array[String]): Unit = {
    println(sort(List(5,6,7)))
  }

}

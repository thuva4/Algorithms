object InsertionSort {

  def sort(numbers: List[Int]): List[Int] = {
    var sortedList = numbers
    for (i <- sortedList.indices) {
      var temp = sortedList(i)
      var j = i - 1
      while ( j >= 0 && sortedList(j) > temp) {
        sortedList = sortedList.updated(j+1, sortedList(j))
        j = j -1
      }
      sortedList = sortedList.updated(j+1, temp)
    }
    sortedList

  }

  def main(args: Array[String]): Unit = {
    println(sort(List(7,5,6,9,10,1,4,8)))
  }

}
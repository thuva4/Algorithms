import scala.reflect.internal.util.Collections

object MergeSort {

  def sort(list: List[Int]) : List[Int] = {
    val mid = list.size

    var sortedList = list

    if( mid == 1 ) {
      list
    }
    else if( mid == 2) {
      if (sortedList.head>sortedList(1)){
        var temp = sortedList.head
        sortedList = sortedList.updated(0, sortedList(1))
        sortedList = sortedList.updated(1, temp)
      }
      sortedList
    }
    else{
      var (sortedList1, sortedList2) = sortedList.splitAt(mid/2)
      sortedList1 = sort(sortedList1)
      sortedList2 = sort(sortedList2)
      merge(sortedList1, sortedList2)
    }

  }

  def merge(list1: List[Int], list2: List[Int]) : List[Int] = {
    var list : collection.mutable.MutableList[Int]= new collection.mutable.MutableList[Int]()

    var i = 0
    var j = 0
    for (k <- 0 until list1.size + list2.size) {
      if (i == list1.size) {
        list.+=(list2(j))
        j = j+ 1
      } else if (j == list2.size) {
        list.+=(list1(i))
        i = i+ 1
      } else {
        if (list1(i) <= list2(j)) {
          list.+=(list1(i))
          i = i + 1
        } else {
          list.+=(list2(j))
          j = j + 1
        }
      }
    }
    list.toList
  }

  def main(args: Array[String]): Unit = {
    println(sort(List(1,5,8, 2,4,6, 10, 3)))
  }
}
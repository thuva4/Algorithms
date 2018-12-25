import scala.util.control.Breaks

object LinearSearch {

  def search(list: List[Int], number: Int) : Int = {
    for (i <- list.indices) {
      if( number == list(i)){
        return i
      }
    }
    -1
  }

  def main(args: Array[String]): Unit = {
    println(search(List(1,6,3,5,9), 3))
    println(search(List(1,6,3,5,9), 2))

  }
}

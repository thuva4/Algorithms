import scala.util.control.Breaks._

object BinarySearch {

  def search(list: List[Int], number: Int) : Boolean = {

    var left : Int = 0;
    var right : Int = list.length-1;
    var mid : Int = 0;

    while (left <= right) {
      mid = ( left + right)/2;

      if(number == list(mid))
        return true;
      else if( number > list(mid) )
        {
          left = mid + 1;
        }
      else
        {
          right = mid-1;
        }
    }

    return false;
  }

  def main(args: Array[String]): Unit = {
    println(search(List(10,20,30,40,90), 30))
    println(search(List(10,20,30,40,90), 3))

  }
}

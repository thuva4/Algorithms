object InsertionSort {

  def sort(numbers: List[Int]): List[Int] = numbers match {
    case List() => List()
    case x :: xs => insert(x, sort(xs))
  }

  def insert(x: Int,numbers: List[Int]): List[Int] = numbers match {
    case List() => List(x)
    case y :: ys => if (x <= y ) x :: numbers else y :: insert(x, ys)
  }

  def main(args: Array[String]): Unit = {
    println(sort(List(7,5,6,9,10,1,4,8)))
  }

}
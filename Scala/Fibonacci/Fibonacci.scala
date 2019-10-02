import scala.annotation.tailrec

/**
 * Calculating a Fibonacci sequence recursively using Scala.
 */
 
object Fibonacci {

    def fib(number: Int) : Int  = {
        if (number == 0) {
            0
        }
        else if(number == 1 ) {
            1
        } else {
           fib(number-1) + fib(number-2)
        }
    }

  def main(args: Array[String]): Unit = {
    for (i <- 1 until 10){
      println(fib(i))
    }

  }
}
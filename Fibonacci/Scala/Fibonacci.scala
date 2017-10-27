object Fibonacci {
  def main(args: Array[String]): Unit = {
    if(args.length==0){
      println("Invalid Argumenet")
    }else{
          (0 to n-1).map(fib(_)).foreach(println)
    }


}

def fib(n:Int):Int = {
  n match {
    case 0 | 1 => 1
    case _ => fib(n-1) + fib(n-2)
  }
}

import java.util.Scanner


fun main(args: Array<String>){
  println("factorial using recursion : ${factorial(10,1)}");
}

fun factorial(n: Int, sum: Int): Int{
  return if(n<=0){
    sum
  }else{
    factorial(n-1, sum*n)
  }
}



import java.util.Scanner
import java.util.*


//BinaryGCD
fun main(args: Array<String>){
  println("BinaryGCD");
  val num1 = 168
  val num2 = 396
    //if one of input is 0, then print the other
    if(num1 == 0) {
      println(num2)
    }else if(num2 == 0){
      println(num1)   
    }else{
      println(gcd(num1, num2))

    }
    
}

fun gcd(a: Int, b: Int):Int{
  var x = a
  var y = b
  var GCD: Int = 0 // Store FInal result
  var divbytwo: Int = 0;
  //if x and y are both the even number, shift right and 
  //save the count of shifting(will be the one of dividend's factor of return)
  while(true){
    if((x or y) and 1 == 0){
       divbytwo++
       x = x shr 1
       y = y shr 1
     }
     else break;
  }
  //if x even, then shift right, since even, odd has same GCD with even/2, ood
  while ((x and 1) == 0)
		x = x shr 1;
    
  while(y != 0){
      while ((y and 1) == 0)
		y = y shr 1;  

      if(x < y){
          y = y- x;
      }else{
        var temp = x - y
        x = y
        y = temp
      }
      y = y shr 1;
  }
  GCD = x
  return GCD shl divbytwo
  
}

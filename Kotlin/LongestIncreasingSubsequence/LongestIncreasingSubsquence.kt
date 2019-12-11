import java.util.Scanner

//Bubble Sort
fun main(args: Array<String>){
  println("Dynamic Programming - Longest Increasing Subsequence");
  var count = 6; //counts of input num
  var arr = intArrayOf(10,20,10,30,20,50) // input num
  var leng = LIS(count, arr);
  println(leng)
}

fun LIS(count: Int, arr: IntArray): Int{
	var max = 1;
    //array : count of increasing subsquence
    val array = arrayOf(1,1,1,1,1,1);
    for(i in 0..count-1){
      for( j in 0..i){
          //if previous + 1 is bigger than count in current than update
          if(arr[i] > arr[j] && array[j] + 1 > array[i]){
              array[i] = array[j] + 1;
          }
      }
    }
    //choose the max count
    for(i in 0..count-1){
        if(max < array[i])
        	max = array[i]
    }
          
  return max;
}

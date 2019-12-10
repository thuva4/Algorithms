import java.util.Scanner

//Bubble Sort
fun main(args: Array<String>){ // no return value
  println("Bubblesort");
//var is read/write allowed variable
  var arr = intArrayOf(5,6,2,7,1,8,9,3,4,10)
  BubbleSort(arr);
}


fun BubbleSort(arr: IntArray){
  for(i in 0.. arr.size-1){
      for( j in 0..arr.size-2){
          if(arr[j] > arr[j+1]){
              var temp = arr[j];
              arr[j] = arr[j+1];
              arr[j+1] = temp;
          }
      }
  }
  for(i in 0..arr.size-1){
  	println(arr[i]);
  }
  
}

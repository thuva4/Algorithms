import java.util.Scanner
import java.util.*


//FloydWarshall
fun main(args: Array<String>){
  println("FloydWarshall");
  var cost = Array<IntArray>(51, {IntArray(51)}) 
  val V = 5; 
  val E = 10;
//V : number of vertices
//E : number of edges
  cost[1][2] = 10; 
  //node 1 is directly connected to node 2 with the weight 10
  cost[1][3] = 5;
  cost[2][3] = 3;
  cost[2][4] = 1;
  cost[3][2] = 2;
  cost[3][4] = 9;
  cost[3][5] = 2;
  cost[4][5] = 6;
  cost[5][1] = 7;
  cost[5][4] = 4;
  //Since we find the minimum, we set 0 to big num
  for(i in 1..V){
      for(j in 1..V){
          if(i != j && cost[i][j] ==0){
              cost[i][j] = 99999999
          }
      }
  }
  

  //if going through intermediate vertex k costs less than
  // original path, then update the weight
  for(k in 1..V){
      for(i in 1..V){
          for(j in 1..V){
              if(cost[i][j] > cost[i][k] + cost[k][j]){
                  cost[i][j] = cost[i][k] + cost[k][j];
              }
          }
      }
  }
 
  //if there's no way or if it is itself, zero 
  for(i in 1..V){
      for(j in 1..V){
          if(cost[i][j] == 99999999){
              cost[i][j] = 0;
          }
      }
  }
  
  for(i in 1..V){
      for(j in 1..V){
          print(cost[i][j].toString() +  " ")
      }
      println()
  }
  
}

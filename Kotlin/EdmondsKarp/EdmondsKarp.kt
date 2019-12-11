import java.util.Scanner
import java.util.*


//FloydWarshall
fun main(args: Array<String>){
  println("FloydWarshall");
  var capacity = Array<IntArray>(51, {IntArray(51)}) 
  var flow = Array<IntArray>(51, {IntArray(51)})
  var visited = IntArray(51){0}
  val V = 5; 
  
//V : number of vertices
//E : number of edges
  capacity[1][2] = 3; 
  //There is pipe between 1 and 2 that has 2 unit of capcity.
  capacity[2][3] = 3;
  capacity[3][4] = 5;
  capacity[4][5] = 4;
  capacity[2][5] = 6; 
  capacity[2][1] = 3;
  capacity[3][2] = 3;
  capacity[4][3] = 5;
  capacity[5][4] = 4;
  capacity[5][2] = 6; 
  val start: Int = 1;
  val end: Int = 5;
    
  var q: Queue<Int> = LinkedList();
  var maxflow: Int = 0;
    

  
  while(true){
      for(i in 1..V){
          visited[i] = 0
      }
 
      q.add(start)
      while(!q.isEmpty()){
          val front = q.poll();
          for(i in 1..V){

              if(front != i && capacity[front][i] != 0){
                  if(capacity[front][i] - flow[front][i] > 0 && visited[i] == 0){
                      q.add(i)
                      visited[i] = front;
                      if(i == end){
                          break;
                      }
                  }
              }
              
          }
          
      }//end of while(q empty)
      if(visited[end] == 0)
      	break; //there is no possible way anymore
 	  
      //find minimum of capacity on the way     
      var allowable_flow: Int = 99999999
      var prev = end;
      while(true){
          if(allowable_flow > (capacity[visited[prev]][prev] - flow[visited[prev]][prev])){
            allowable_flow = capacity[visited[prev]][prev] - flow[visited[prev]][prev];
          }

          prev = visited[prev]
          if(prev == start)
          	break;
      }
      prev = end;
      //update the flow (current flowing amount)
      while(true){
          flow[visited[prev]][prev] += allowable_flow
          flow[prev][visited[prev]] += allowable_flow
          prev = visited[prev]
          if(prev == start)
          	break;
      }
      maxflow = maxflow + allowable_flow
  }
  println(maxflow)
  
}

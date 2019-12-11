import java.util.Scanner
import java.util.*
//boolean array to check if the node is visited or not
val visited = BooleanArray(1001){false}

class Edge(_from: Int, _to: Int){
    var from: Int;
    var to: Int;
   
    init {
        this.from = _from
        this.to = _to
    }

    
}

//DFS
fun main(args: Array<String>){
  println("DFS");
  //number of vertices and edges
  var V = 4
  var E = 5
  //starting point
  var Start = 1
  val edge: Array<Edge> = Array(E+1) { Edge(0, 0) }
  edge[0] = Edge(1,2)	
  edge[1] = Edge(1,3)
  edge[2] = Edge(1,4)
  edge[3] = Edge(2,4)
  edge[4] = Edge(3,4)
  var a = 0; var b= 0;
  val adjacent_array = Array<ArrayList<Int>>(V+1){ArrayList()}
  for(i in 0..V-1){
      a = edge[i].from
      b = edge[i].to
      adjacent_array[a].add(b)
      adjacent_array[b].add(a)
  }

  
  visited[1] = true;
  DFS(adjacent_array, Start)
  
  
}

//recursively call DFS func when not visited
fun DFS(adja: Array<ArrayList<Int>>, ver: Int){
    println(ver)
    visited[ver] = true;
    adja[ver].forEach {
        if(visited[it] == false){
            DFS(adja, it)
        }
    }
    
}

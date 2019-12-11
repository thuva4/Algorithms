import java.util.Scanner
import java.util.*

//class Edge which describes the edge b/w two vertices
class Edge(_from: Int, _to: Int){
    var from: Int;
    var to: Int;
   
    init {
        this.from = _from
        this.to = _to
    }

    
}

//BFS
fun main(args: Array<String>){
  println("BFS");
  // V : number of vertices
  // E : number of Edges
  var V = 4
  var E = 5
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

  var q: Queue<Int> = LinkedList()
  val visited = BooleanArray(V+1){false}
  q.add(Start);
  visited[1] = true;
  
    while(!q.isEmpty()){
        var temp = q.poll();
        println(temp)
        //if not visited and connected to current node, then push Q
        adjacent_array[temp].forEach {
            if(visited[it] == false){
                visited[it] = true
                q.add(it);
            }
        }
        }
}
    




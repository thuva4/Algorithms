import java.util.*;

class vertex implements Comparable<vertex>{
	int adjvertex;
	int weight;
	public vertex(int adjvertex, int weight) {
		this.adjvertex = adjvertex;
		this.weight = weight;
	}
	@Override
	public int compareTo(vertex arg0) {
		// TODO Auto-generated method stub
		if(this.weight > arg0.getWeight()) return 1;
		else if(this.weight == arg0.getWeight()) return 0;
		else return -1;
	}
	public int getAdjvertex() {
		return adjvertex;
	}
	public void setAdjvertex(int adjvertex) {
		this.adjvertex = adjvertex;
	}
	public int getWeight() {
		return weight;
	}
	public void setWeight(int weight) {
		this.weight = weight;
	}
	
}

public class prim {
	static ArrayList<vertex>[] vertexList;
	static boolean visited[];
	static int result;
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		Scanner sc = new Scanner(System.in);
		int V = sc.nextInt();
		int E = sc.nextInt();
		vertexList = new ArrayList[V+1];
		visited = new boolean[V+1];
		for(int i = 1; i <= V; i++)
			vertexList[i] = new ArrayList<vertex>();
		for(int i = 0; i < E; i++) {
			int start = sc.nextInt();
			int end = sc.nextInt();
			int weight = sc.nextInt();
			vertex ver = new vertex(end, weight);
			vertex ver2 = new vertex(start, weight);
			vertexList[start].add(ver);
            vertexList[end].add(ver2);
		}
		PriorityQueue<vertex> minq = new PriorityQueue<vertex>();
		visited[1] = true;
		Iterator<vertex> it = vertexList[1].iterator();
		while(it.hasNext()) {
			minq.offer(it.next());
		}
		int count=0;
        while(!minq.isEmpty()) {
            vertex pollVertex=minq.poll();
            int v=pollVertex.getAdjvertex();
            if(visited[v]==true) continue;
            int w=pollVertex.getWeight();
            result+=w;
            visited[v]=true;
            count++;
            if(count==V+1) break;
            Iterator<vertex> it2=vertexList[v].iterator();
            while(it2.hasNext()) {
                minq.add(it2.next());
            }
        }
        System.out.println(result);


	}

}

import java.util.ArrayList;
import java.util.Scanner;

public class DFS_Recursive {

	/**
	 * @author Youssef Ali(https://github.com/youssefAli11997/)
	 */
	
	private static boolean[] visited;
	private static ArrayList<Integer> AdjList[];
	
	public static void DFS_recursive(int parent){
		visited[parent] = true;
		System.out.print(parent+" ");
		for(int child : AdjList[parent]){
			if(visited[child])
				continue;
			DFS_recursive(child);
		}
	}
	
	@SuppressWarnings("unchecked")
	public static void main(String[] args) {
		Scanner in = new Scanner(System.in);
		
		System.out.println("How many nodes?");
		int nodes = in.nextInt();
		
		visited = new boolean[nodes];
		AdjList = new ArrayList[nodes];
		for(int i=0; i<nodes; i++)
			AdjList[i] = new ArrayList<Integer>();
		
		System.out.println("How many edges?");
		int edges = in.nextInt();
		
		for(int i=0; i<edges; i++){
			System.out.println("To indicate that u is connected to v, type: u v");
			int u = in.nextInt();
			int v = in.nextInt();
			// Assuming that it's an undirected graph
			AdjList[u].add(v);
			AdjList[v].add(u);
		}
		System.out.println("Source node?");
		int source = in.nextInt();
		
		DFS_recursive(source);
		System.out.println();
	}

}

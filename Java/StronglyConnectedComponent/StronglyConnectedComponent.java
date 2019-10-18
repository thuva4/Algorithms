import java.util.*;

class Graph{

    private int V; // No. of vertices
    private LinkedList<Integer> adj[]; // Adjacency List

    //Constructor
    Graph(int v)
    {
        V = v;
        adj = new LinkedList[v];
        for (int i=0; i<v; ++i)
            adj[i] = new LinkedList();
    }

    // Function to add an edge into the graph
    void addEdge(int v,int w) { adj[v].add(w); }

    void traversalUtil(int v, boolean[] visited, Set<Integer> set){
        visited[v] = true;
        set.add(v);
        Iterator<Integer> it = adj[v].iterator();
        while (it.hasNext())
        {
            Integer i = it.next();
            if (!visited[i]){
                traversalUtil(i, visited, set);
            }

        }
    }


    List<Set<Integer>> findConnectedComponents(){
        List<Set<Integer>> connectedComponents = new ArrayList<>();

        boolean visited[] = new boolean[this.V];

        for(int i = 0; i< visited.length; i++){
            visited[i] = false;
        }

        for(int i=0; i<this.V; i++){
            Set<Integer> set = new HashSet<Integer>();
            if(!visited[i]){
                traversalUtil(i, visited, set);
                connectedComponents.add(set);
            }
        }

        return connectedComponents;
    }

    public static void main(String args[]){
        Graph graph = new Graph(8);
        graph.addEdge(0, 1);
        graph.addEdge(1, 2);
        graph.addEdge(1, 3);
        graph.addEdge(4, 5);


        List<Set<Integer>> connectedComponents = graph.findConnectedComponents();

        System.out.println("\n");

        connectedComponents.forEach(set -> {
            set.forEach(v -> {
                System.out.print(v + ", ");
            });
            System.out.println("\n");
        });

    }




}
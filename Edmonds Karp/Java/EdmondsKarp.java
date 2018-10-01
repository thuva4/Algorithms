import java.util.*;

public class EdmondsKarp {
    public static void main(String[] args) {
        int verticesCount = 6;
        double[][] capacity = initCapacity(verticesCount);
        int s = 0;
        int t = verticesCount - 1;
        Map<Integer, List<Edge>> graphForwardEdges = initForwardGraphEdges();
        Map<Integer, List<Edge>> graphReverseEdges = initReverseGraphEdges();

        double maxFlow = calculateMaxFlow(graphForwardEdges, graphReverseEdges, s, t, capacity);
        System.out.println(maxFlow);
    }

    private static double calculateMaxFlow(Map<Integer, List<Edge>> graphForwardEdges,
                                          Map<Integer, List<Edge>> graphReverseEdges,
                                          int s, int t, double[][] capacity) {
        int verticesCount = graphForwardEdges.size();
        double[][] flow = new double[verticesCount][verticesCount];
        double maxFlow = 0.0;
        boolean isPathExist = true;
        Deque<Integer> queue = new ArrayDeque<>();

        while (isPathExist) {
            Edge[] parent = new Edge[verticesCount];
            boolean[] visited = new boolean[verticesCount];
            queue.addLast(s);

            //  choose path from s to t
            while (!queue.isEmpty()) {
                int currentVertex = queue.pollFirst();
                visited[currentVertex] = true;
                List<Edge> outEdges = graphForwardEdges.get(currentVertex);

                for (Edge edge : outEdges) {
                    int to = edge.getTo();
                    if (!visited[to]) {
                        if (capacity[currentVertex][to] - flow[currentVertex][to] > 0 &&
                                flow[currentVertex][to] >= 0) {
                            parent[to] = edge;
                            queue.addLast(to);
                        }
                    }
                }

                List<Edge> inEdges = graphReverseEdges.get(currentVertex);
                for (Edge edge : inEdges) {
                    int from = edge.getFrom();
                    if (!visited[from]) {
                        if (flow[from][currentVertex] > 0) {
                            parent[from] = edge;
                            queue.addLast(from);
                        }
                    }
                }
            }

            isPathExist = visited[t];

            //   find max possible flow of the chosen path
            if (isPathExist) {
                int child = t;
                double bottleneck = Double.MAX_VALUE;

                while (child != s) {
                    Edge edge = parent[child];
                    if (!edge.isReverse()) {
                        bottleneck = Math.min(bottleneck, capacity[edge.getFrom()][edge.getTo()] -
                                flow[edge.getFrom()][edge.getTo()]);
                    } else {
                        bottleneck = Math.min(bottleneck, flow[edge.getFrom()][edge.getTo()]);
                    }

                    child = edge.isReverse() ? edge.getTo() : edge.getFrom();
                }

                //  update flow
                maxFlow += bottleneck;
                child = t;
                while (child != s) {
                    Edge edge = parent[child];
                    int from = (!edge.isReverse()) ? edge.getFrom() : edge.getTo();
                    flow[from][child] += bottleneck;
                    flow[child][from] -= bottleneck;
                    child = (!edge.isReverse()) ? edge.getFrom() : edge.getTo();
                }
            }
        }

        return maxFlow;
    }

    private static double[][] initCapacity(int verticesCount) {
        double[][] capacity = new double[verticesCount][verticesCount];
        capacity[0][1] = 10;
        capacity[1][0] = 10;

        capacity[0][3] = 10;
        capacity[3][0] = 10;


        capacity[1][2] = 4;
        capacity[2][1] = 4;

        capacity[1][3] = 2;
        capacity[3][1] = 2;

        capacity[1][4] = 8;
        capacity[4][1] = 8;


        capacity[2][5] = 10;
        capacity[5][2] = 10;


        capacity[3][4] = 9;
        capacity[4][3] = 9;


        capacity[4][2] = 6;
        capacity[2][4] = 6;

        capacity[4][5] = 10;
        capacity[5][4] = 10;

        return capacity;
    }

    private static Map<Integer, List<Edge>> initForwardGraphEdges() {
        Map<Integer, List<Edge>> graph = new HashMap<>();
        graph.put(0, createForwardEdges(0, 1, 3));
        graph.put(1, createForwardEdges(1, 2, 3, 4));
        graph.put(2, createForwardEdges(2, 5));
        graph.put(3, createForwardEdges(3, 4));
        graph.put(4, createForwardEdges(4, 2, 5));
        graph.put(5, Collections.emptyList());

        return graph;
    }

    private static Map<Integer, List<Edge>> initReverseGraphEdges() {
        Map<Integer, List<Edge>> graph = new HashMap<>();
        graph.put(0, Collections.emptyList());
        graph.put(1, Collections.emptyList());
        graph.put(2, createReverseEdges(2, 1, 4));
        graph.put(3, createReverseEdges(3, 1));
        graph.put(4, createReverseEdges(4, 1, 3));
        graph.put(5, Collections.emptyList());

        return graph;
    }

    private static List<Edge> createForwardEdges(int from, Integer... toVertices) {
        List<Edge> edges = new ArrayList<>();

        for (Integer to : toVertices) {
            Edge edge = new Edge(from, to, false);
            edges.add(edge);
        }

        return edges;
    }

    private static List<Edge> createReverseEdges(int to, Integer... fromVertices) {
        List<Edge> edges = new ArrayList<>();

        for (Integer from : fromVertices) {
            Edge edge = new Edge(from, to, true);
            edges.add(edge);
        }

        return edges;
    }

    private static class Edge {
        private int from;
        private int to;
        private boolean isReverse;

        Edge(int from, int to, boolean isReverse) {
            this.from = from;
            this.to = to;
            this.isReverse = isReverse;
        }

        int getFrom() {
            return from;
        }

        int getTo() {
            return to;
        }

        boolean isReverse() {
            return isReverse;
        }
    }
}
package algorithms.searching.bestfirstsearch;

import java.util.*;

public class BestFirstSearch {
    static class Node implements Comparable<Node> {
        int id;
        int heuristic;

        public Node(int id, int heuristic) {
            this.id = id;
            this.heuristic = heuristic;
        }

        @Override
        public int compareTo(Node other) {
            return Integer.compare(this.heuristic, other.heuristic);
        }
    }

    public static List<Integer> search(int n, List<List<Integer>> adj, int start, int target, int[] heuristic) {
        PriorityQueue<Node> pq = new PriorityQueue<>();
        boolean[] visited = new boolean[n];
        int[] parent = new int[n];
        Arrays.fill(parent, -1);

        pq.add(new Node(start, heuristic[start]));
        visited[start] = true;

        boolean found = false;

        while (!pq.isEmpty()) {
            Node current = pq.poll();
            int u = current.id;

            if (u == target) {
                found = true;
                break;
            }

            for (int v : adj.get(u)) {
                if (!visited[v]) {
                    visited[v] = true;
                    parent[v] = u;
                    pq.add(new Node(v, heuristic[v]));
                }
            }
        }

        List<Integer> path = new ArrayList<>();
        if (found) {
            int curr = target;
            while (curr != -1) {
                path.add(curr);
                curr = parent[curr];
            }
            Collections.reverse(path);
        }
        return path;
    }

    public static int[] bestFirstSearch(
            java.util.Map<Integer, java.util.List<Integer>> adjacencyList,
            int startNode,
            int goalNode,
            java.util.Map<Integer, Integer> heuristicValues) {
        int n = 0;
        for (int node : adjacencyList.keySet()) {
            n = Math.max(n, node + 1);
        }
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            adj.add(new ArrayList<>(adjacencyList.getOrDefault(i, Collections.emptyList())));
        }
        int[] heuristic = new int[n];
        for (int i = 0; i < n; i++) {
            heuristic[i] = heuristicValues.getOrDefault(i, 0);
        }
        List<Integer> path = search(n, adj, startNode, goalNode, heuristic);
        int[] result = new int[path.size()];
        for (int i = 0; i < path.size(); i++) {
            result[i] = path.get(i);
        }
        return result;
    }
}

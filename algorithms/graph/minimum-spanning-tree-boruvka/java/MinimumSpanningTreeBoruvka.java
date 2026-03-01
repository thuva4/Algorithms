public class MinimumSpanningTreeBoruvka {

    static int[] parent, rank;

    static int find(int x) {
        while (parent[x] != x) {
            parent[x] = parent[parent[x]];
            x = parent[x];
        }
        return x;
    }

    static boolean union(int x, int y) {
        int rx = find(x), ry = find(y);
        if (rx == ry) return false;
        if (rank[rx] < rank[ry]) { int t = rx; rx = ry; ry = t; }
        parent[ry] = rx;
        if (rank[rx] == rank[ry]) rank[rx]++;
        return true;
    }

    /**
     * Find the minimum spanning tree using Boruvka's algorithm.
     *
     * Input format: [n, m, u1, v1, w1, u2, v2, w2, ...]
     * @param arr input array
     * @return total weight of the MST
     */
    public static int minimumSpanningTreeBoruvka(int[] arr) {
        int idx = 0;
        int n = arr[idx++];
        int m = arr[idx++];
        int[][] edges = new int[m][3];
        for (int i = 0; i < m; i++) {
            edges[i][0] = arr[idx++];
            edges[i][1] = arr[idx++];
            edges[i][2] = arr[idx++];
        }

        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;

        int totalWeight = 0;
        int numComponents = n;

        while (numComponents > 1) {
            int[] cheapest = new int[n];
            for (int i = 0; i < n; i++) cheapest[i] = -1;

            for (int i = 0; i < m; i++) {
                int ru = find(edges[i][0]), rv = find(edges[i][1]);
                if (ru == rv) continue;
                if (cheapest[ru] == -1 || edges[i][2] < edges[cheapest[ru]][2])
                    cheapest[ru] = i;
                if (cheapest[rv] == -1 || edges[i][2] < edges[cheapest[rv]][2])
                    cheapest[rv] = i;
            }

            for (int node = 0; node < n; node++) {
                if (cheapest[node] != -1) {
                    if (union(edges[cheapest[node]][0], edges[cheapest[node]][1])) {
                        totalWeight += edges[cheapest[node]][2];
                        numComponents--;
                    }
                }
            }
        }

        return totalWeight;
    }

    public static void main(String[] args) {
        System.out.println(minimumSpanningTreeBoruvka(new int[]{3, 3, 0, 1, 1, 1, 2, 2, 0, 2, 3}));
        System.out.println(minimumSpanningTreeBoruvka(new int[]{4, 5, 0, 1, 10, 0, 2, 6, 0, 3, 5, 1, 3, 15, 2, 3, 4}));
        System.out.println(minimumSpanningTreeBoruvka(new int[]{2, 1, 0, 1, 7}));
        System.out.println(minimumSpanningTreeBoruvka(new int[]{4, 3, 0, 1, 1, 1, 2, 2, 2, 3, 3}));
    }
}

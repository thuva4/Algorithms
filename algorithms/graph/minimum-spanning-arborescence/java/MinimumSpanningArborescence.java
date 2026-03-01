import java.util.*;

public class MinimumSpanningArborescence {

    public static int minimumSpanningArborescence(int[] arr) {
        int n = arr[0];
        int m = arr[1];
        int root = arr[2];
        int[] eu = new int[m], ev = new int[m], ew = new int[m];
        for (int i = 0; i < m; i++) {
            eu[i] = arr[3 + 3 * i];
            ev[i] = arr[3 + 3 * i + 1];
            ew[i] = arr[3 + 3 * i + 2];
        }

        int INF = Integer.MAX_VALUE / 2;
        int res = 0;
        int edgeCount = m;

        while (true) {
            int[] minIn = new int[n];
            int[] minEdge = new int[n];
            Arrays.fill(minIn, INF);
            Arrays.fill(minEdge, -1);

            for (int i = 0; i < edgeCount; i++) {
                if (eu[i] != ev[i] && ev[i] != root && ew[i] < minIn[ev[i]]) {
                    minIn[ev[i]] = ew[i];
                    minEdge[ev[i]] = eu[i];
                }
            }

            for (int i = 0; i < n; i++) {
                if (i != root && minIn[i] == INF) return -1;
            }

            int[] comp = new int[n];
            Arrays.fill(comp, -1);
            comp[root] = root;
            int numCycles = 0;

            for (int i = 0; i < n; i++) {
                if (i != root) res += minIn[i];
            }

            int[] visited = new int[n];
            Arrays.fill(visited, -1);

            for (int i = 0; i < n; i++) {
                if (i == root) continue;
                int v = i;
                while (visited[v] == -1 && comp[v] == -1 && v != root) {
                    visited[v] = i;
                    v = minEdge[v];
                }
                if (v != root && comp[v] == -1 && visited[v] == i) {
                    int u = v;
                    do {
                        comp[u] = numCycles;
                        u = minEdge[u];
                    } while (u != v);
                    numCycles++;
                }
            }

            if (numCycles == 0) break;

            for (int i = 0; i < n; i++) {
                if (comp[i] == -1) {
                    comp[i] = numCycles++;
                }
            }

            int newCount = 0;
            int[] neu = new int[edgeCount], nev = new int[edgeCount], newW = new int[edgeCount];
            for (int i = 0; i < edgeCount; i++) {
                int nu = comp[eu[i]];
                int nv = comp[ev[i]];
                if (nu != nv) {
                    neu[newCount] = nu;
                    nev[newCount] = nv;
                    newW[newCount] = ew[i] - minIn[ev[i]];
                    newCount++;
                }
            }

            eu = neu; ev = nev; ew = newW;
            edgeCount = newCount;
            root = comp[root];
            n = numCycles;
        }

        return res;
    }
}

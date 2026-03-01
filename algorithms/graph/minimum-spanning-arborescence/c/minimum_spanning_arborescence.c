#include "minimum_spanning_arborescence.h"
#include <limits.h>
#include <string.h>

#define MAX_E 5000
#define MAX_V 500

int minimum_spanning_arborescence(int arr[], int size) {
    int n = arr[0];
    int m = arr[1];
    int root = arr[2];
    int eu[MAX_E], ev[MAX_E], ew[MAX_E];
    int edgeCount = m;
    for (int i = 0; i < m; i++) {
        eu[i] = arr[3 + 3 * i];
        ev[i] = arr[3 + 3 * i + 1];
        ew[i] = arr[3 + 3 * i + 2];
    }

    int INF = INT_MAX / 2;
    int res = 0;

    while (1) {
        int minIn[MAX_V], minEdge[MAX_V];
        for (int i = 0; i < n; i++) { minIn[i] = INF; minEdge[i] = -1; }

        for (int i = 0; i < edgeCount; i++) {
            if (eu[i] != ev[i] && ev[i] != root && ew[i] < minIn[ev[i]]) {
                minIn[ev[i]] = ew[i];
                minEdge[ev[i]] = eu[i];
            }
        }

        for (int i = 0; i < n; i++) {
            if (i != root && minIn[i] == INF) return -1;
        }

        int comp[MAX_V];
        memset(comp, -1, sizeof(int) * n);
        comp[root] = root;
        int numCycles = 0;

        for (int i = 0; i < n; i++) {
            if (i != root) res += minIn[i];
        }

        int visited[MAX_V];
        memset(visited, -1, sizeof(int) * n);

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
            if (comp[i] == -1) comp[i] = numCycles++;
        }

        int neu[MAX_E], nev[MAX_E], newW[MAX_E];
        int newCount = 0;
        for (int i = 0; i < edgeCount; i++) {
            int nu = comp[eu[i]], nv = comp[ev[i]];
            if (nu != nv) {
                neu[newCount] = nu;
                nev[newCount] = nv;
                newW[newCount] = ew[i] - minIn[ev[i]];
                newCount++;
            }
        }

        for (int i = 0; i < newCount; i++) {
            eu[i] = neu[i]; ev[i] = nev[i]; ew[i] = newW[i];
        }
        edgeCount = newCount;
        root = comp[root];
        n = numCycles;
    }

    return res;
}

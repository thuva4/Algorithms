#include <vector>
#include <climits>
#include <algorithm>

using namespace std;

int minimum_spanning_arborescence(vector<int> arr) {
    int n = arr[0];
    int m = arr[1];
    int root = arr[2];
    vector<int> eu(m), ev(m), ew(m);
    for (int i = 0; i < m; i++) {
        eu[i] = arr[3 + 3 * i];
        ev[i] = arr[3 + 3 * i + 1];
        ew[i] = arr[3 + 3 * i + 2];
    }

    int INF = INT_MAX / 2;
    int res = 0;

    while (true) {
        vector<int> minIn(n, INF), minEdge(n, -1);

        for (int i = 0; i < (int)eu.size(); i++) {
            if (eu[i] != ev[i] && ev[i] != root && ew[i] < minIn[ev[i]]) {
                minIn[ev[i]] = ew[i];
                minEdge[ev[i]] = eu[i];
            }
        }

        for (int i = 0; i < n; i++) {
            if (i != root && minIn[i] == INF) return -1;
        }

        vector<int> comp(n, -1);
        comp[root] = root;
        int numCycles = 0;

        for (int i = 0; i < n; i++) {
            if (i != root) res += minIn[i];
        }

        vector<int> visited(n, -1);
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

        vector<int> neu, nev, newW;
        for (int i = 0; i < (int)eu.size(); i++) {
            int nu = comp[eu[i]], nv = comp[ev[i]];
            if (nu != nv) {
                neu.push_back(nu);
                nev.push_back(nv);
                newW.push_back(ew[i] - minIn[ev[i]]);
            }
        }

        eu = neu; ev = nev; ew = newW;
        root = comp[root];
        n = numCycles;
    }

    return res;
}

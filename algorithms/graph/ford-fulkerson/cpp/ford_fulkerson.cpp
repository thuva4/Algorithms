#include <vector>
#include <algorithm>
#include <climits>

static int n_ff;
static std::vector<std::vector<int>> cap_ff;

static int dfs(int u, int sink, int flow, std::vector<bool>& visited) {
    if (u == sink) return flow;
    visited[u] = true;
    for (int v = 0; v < n_ff; v++) {
        if (!visited[v] && cap_ff[u][v] > 0) {
            int d = dfs(v, sink, std::min(flow, cap_ff[u][v]), visited);
            if (d > 0) { cap_ff[u][v] -= d; cap_ff[v][u] += d; return d; }
        }
    }
    return 0;
}

int ford_fulkerson(std::vector<int> arr) {
    n_ff = arr[0]; int m = arr[1]; int src = arr[2]; int sink = arr[3];
    cap_ff.assign(n_ff, std::vector<int>(n_ff, 0));
    for (int i = 0; i < m; i++) cap_ff[arr[4+3*i]][arr[5+3*i]] += arr[6+3*i];
    int maxFlow = 0;
    while (true) {
        std::vector<bool> visited(n_ff, false);
        int flow = dfs(src, sink, INT_MAX, visited);
        if (flow == 0) break;
        maxFlow += flow;
    }
    return maxFlow;
}

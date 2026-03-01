#include <vector>
#include <queue>
#include <algorithm>
#include <climits>
#include <cstring>

int max_flow_min_cut(std::vector<int> arr) {
    int n = arr[0], m = arr[1], src = arr[2], sink = arr[3];
    std::vector<std::vector<int>> cap(n, std::vector<int>(n, 0));
    for (int i = 0; i < m; i++) cap[arr[4+3*i]][arr[5+3*i]] += arr[6+3*i];
    int maxFlow = 0;
    std::vector<int> parent(n);
    while (true) {
        std::fill(parent.begin(), parent.end(), -1);
        parent[src] = src;
        std::queue<int> q;
        q.push(src);
        while (!q.empty() && parent[sink] == -1) {
            int u = q.front(); q.pop();
            for (int v = 0; v < n; v++)
                if (parent[v] == -1 && cap[u][v] > 0) { parent[v] = u; q.push(v); }
        }
        if (parent[sink] == -1) break;
        int flow = INT_MAX;
        for (int v = sink; v != src; v = parent[v]) flow = std::min(flow, cap[parent[v]][v]);
        for (int v = sink; v != src; v = parent[v]) { cap[parent[v]][v] -= flow; cap[v][parent[v]] += flow; }
        maxFlow += flow;
    }
    return maxFlow;
}

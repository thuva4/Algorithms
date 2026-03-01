#include <vector>
#include <queue>

int topological_sort_parallel(const std::vector<int>& data) {
    int n = data[0];
    int m = data[1];

    std::vector<std::vector<int>> adj(n);
    std::vector<int> indegree(n, 0);

    int idx = 2;
    for (int e = 0; e < m; e++) {
        int u = data[idx], v = data[idx + 1];
        adj[u].push_back(v);
        indegree[v]++;
        idx += 2;
    }

    std::queue<int> q;
    for (int i = 0; i < n; i++) {
        if (indegree[i] == 0) q.push(i);
    }

    int rounds = 0;
    int processed = 0;

    while (!q.empty()) {
        int size = static_cast<int>(q.size());
        for (int i = 0; i < size; i++) {
            int node = q.front(); q.pop();
            processed++;
            for (int neighbor : adj[node]) {
                indegree[neighbor]--;
                if (indegree[neighbor] == 0) {
                    q.push(neighbor);
                }
            }
        }
        rounds++;
    }

    return processed == n ? rounds : -1;
}

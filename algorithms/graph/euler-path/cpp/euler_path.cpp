#include <vector>
#include <stack>

int euler_path(std::vector<int> arr) {
    int n = arr[0], m = arr[1];
    if (n == 0) return 1;
    std::vector<std::vector<int>> adj(n);
    std::vector<int> degree(n, 0);
    for (int i = 0; i < m; i++) {
        int u = arr[2+2*i], v = arr[3+2*i];
        adj[u].push_back(v);
        adj[v].push_back(u);
        degree[u]++; degree[v]++;
    }
    for (int d : degree) if (d % 2 != 0) return 0;
    int start = -1;
    for (int i = 0; i < n; i++) if (degree[i] > 0) { start = i; break; }
    if (start == -1) return 1;
    std::vector<bool> visited(n, false);
    std::stack<int> st;
    st.push(start);
    visited[start] = true;
    while (!st.empty()) {
        int v = st.top(); st.pop();
        for (int u : adj[v]) if (!visited[u]) { visited[u] = true; st.push(u); }
    }
    for (int i = 0; i < n; i++) if (degree[i] > 0 && !visited[i]) return 0;
    return 1;
}

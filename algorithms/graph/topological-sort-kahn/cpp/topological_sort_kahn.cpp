#include <vector>
#include <queue>

std::vector<int> topologicalSortKahn(std::vector<int> arr) {
    if (arr.size() < 2) {
        return {};
    }

    int numVertices = arr[0];
    int numEdges = arr[1];

    std::vector<std::vector<int>> adj(numVertices);
    std::vector<int> inDegree(numVertices, 0);

    for (int i = 0; i < numEdges; i++) {
        int u = arr[2 + 2 * i];
        int v = arr[2 + 2 * i + 1];
        adj[u].push_back(v);
        inDegree[v]++;
    }

    std::queue<int> q;
    for (int v = 0; v < numVertices; v++) {
        if (inDegree[v] == 0) {
            q.push(v);
        }
    }

    std::vector<int> result;
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        result.push_back(u);
        for (int v : adj[u]) {
            inDegree[v]--;
            if (inDegree[v] == 0) {
                q.push(v);
            }
        }
    }

    if (static_cast<int>(result.size()) == numVertices) {
        return result;
    }
    return {};
}

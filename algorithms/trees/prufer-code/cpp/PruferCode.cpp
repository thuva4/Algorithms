#include <queue>
#include <vector>

std::vector<int> prufer_encode(int n, const std::vector<std::vector<int>>& edges) {
    if (n <= 2) {
        return {};
    }

    std::vector<std::vector<int>> adjacency(n);
    std::vector<int> degree(n, 0);
    for (const std::vector<int>& edge : edges) {
        if (edge.size() != 2) {
            continue;
        }
        int u = edge[0];
        int v = edge[1];
        adjacency[u].push_back(v);
        adjacency[v].push_back(u);
        ++degree[u];
        ++degree[v];
    }

    std::priority_queue<int, std::vector<int>, std::greater<int>> leaves;
    for (int node = 0; node < n; ++node) {
        if (degree[node] == 1) {
            leaves.push(node);
        }
    }

    std::vector<int> sequence;
    sequence.reserve(n - 2);
    for (int step = 0; step < n - 2; ++step) {
        int leaf = leaves.top();
        leaves.pop();

        int neighbor = -1;
        for (int next : adjacency[leaf]) {
            if (degree[next] > 0) {
                neighbor = next;
                break;
            }
        }

        sequence.push_back(neighbor);
        --degree[leaf];
        --degree[neighbor];
        if (degree[neighbor] == 1) {
            leaves.push(neighbor);
        }
    }

    return sequence;
}

#include <iostream>
#include <vector>
#include <queue>
#include <climits>
#include <cstring>

using namespace std;

/**
 * Edmonds-Karp algorithm (BFS-based Ford-Fulkerson) for maximum flow.
 */
class EdmondsKarp {
public:
    static int maxFlow(vector<vector<int>>& capacity, int source, int sink) {
        if (source == sink) return 0;

        int n = capacity.size();
        vector<vector<int>> residual(n, vector<int>(n));
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                residual[i][j] = capacity[i][j];

        int totalFlow = 0;

        while (true) {
            // BFS to find augmenting path
            vector<int> parent(n, -1);
            vector<bool> visited(n, false);
            queue<int> q;
            q.push(source);
            visited[source] = true;

            while (!q.empty() && !visited[sink]) {
                int u = q.front();
                q.pop();
                for (int v = 0; v < n; v++) {
                    if (!visited[v] && residual[u][v] > 0) {
                        visited[v] = true;
                        parent[v] = u;
                        q.push(v);
                    }
                }
            }

            if (!visited[sink]) break;

            // Find minimum capacity along path
            int pathFlow = INT_MAX;
            for (int v = sink; v != source; v = parent[v]) {
                pathFlow = min(pathFlow, residual[parent[v]][v]);
            }

            // Update residual capacities
            for (int v = sink; v != source; v = parent[v]) {
                residual[parent[v]][v] -= pathFlow;
                residual[v][parent[v]] += pathFlow;
            }

            totalFlow += pathFlow;
        }

        return totalFlow;
    }
};

int main() {
    vector<vector<int>> capacity = {
        {0, 10, 10, 0, 0, 0},
        {0, 0, 2, 4, 8, 0},
        {0, 0, 0, 0, 9, 0},
        {0, 0, 0, 0, 0, 10},
        {0, 0, 0, 6, 0, 10},
        {0, 0, 0, 0, 0, 0}
    };

    cout << "Maximum flow: " << EdmondsKarp::maxFlow(capacity, 0, 5) << endl;
    return 0;
}
#include <algorithm>
#include <climits>
#include <queue>
#include <vector>

int edmonds_karp(std::vector<std::vector<int>> capacity_matrix, int source, int sink) {
    if (source == sink || source < 0 || sink < 0 || source >= static_cast<int>(capacity_matrix.size()) ||
        sink >= static_cast<int>(capacity_matrix.size())) {
        return 0;
    }

    int n = static_cast<int>(capacity_matrix.size());
    int max_flow = 0;

    while (true) {
        std::vector<int> parent(n, -1);
        parent[source] = source;
        std::queue<int> queue;
        queue.push(source);

        while (!queue.empty() && parent[sink] == -1) {
            int node = queue.front();
            queue.pop();
            for (int next = 0; next < n; ++next) {
                if (parent[next] == -1 && capacity_matrix[node][next] > 0) {
                    parent[next] = node;
                    queue.push(next);
                }
            }
        }

        if (parent[sink] == -1) {
            break;
        }

        int flow = INT_MAX;
        for (int node = sink; node != source; node = parent[node]) {
            flow = std::min(flow, capacity_matrix[parent[node]][node]);
        }
        for (int node = sink; node != source; node = parent[node]) {
            capacity_matrix[parent[node]][node] -= flow;
            capacity_matrix[node][parent[node]] += flow;
        }
        max_flow += flow;
    }

    return max_flow;
}

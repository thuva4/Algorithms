#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
#include <climits>
using namespace std;

int dpOnTrees(int n, vector<int>& values, vector<pair<int,int>>& edges) {
    if (n == 0) return 0;
    if (n == 1) return values[0];

    vector<vector<int>> adj(n);
    for (auto& e : edges) {
        adj[e.first].push_back(e.second);
        adj[e.second].push_back(e.first);
    }

    vector<int> dp(n, 0);
    vector<int> parent(n, -1);
    vector<bool> visited(n, false);

    // BFS order
    vector<int> order;
    queue<int> q;
    q.push(0);
    visited[0] = true;
    while (!q.empty()) {
        int node = q.front(); q.pop();
        order.push_back(node);
        for (int child : adj[node]) {
            if (!visited[child]) {
                visited[child] = true;
                parent[child] = node;
                q.push(child);
            }
        }
    }

    // Process leaves first
    for (int i = (int)order.size() - 1; i >= 0; i--) {
        int node = order[i];
        int bestChild = 0;
        for (int child : adj[node]) {
            if (child != parent[node]) {
                bestChild = max(bestChild, dp[child]);
            }
        }
        dp[node] = values[node] + bestChild;
    }

    return *max_element(dp.begin(), dp.end());
}

int main() {
    int n;
    cin >> n;
    vector<int> values(n);
    for (int i = 0; i < n; i++) cin >> values[i];
    vector<pair<int,int>> edges(n - 1);
    for (int i = 0; i < n - 1; i++) {
        cin >> edges[i].first >> edges[i].second;
    }
    cout << dpOnTrees(n, values, edges) << endl;
    return 0;
}

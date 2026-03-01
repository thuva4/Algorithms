#include <iostream>
#include <vector>
using namespace std;

vector<vector<int>> adj;
vector<bool> removed;
vector<int> subtreeSize;

void getSubtreeSize(int v, int parent) {
    subtreeSize[v] = 1;
    for (int u : adj[v])
        if (u != parent && !removed[u]) {
            getSubtreeSize(u, v);
            subtreeSize[v] += subtreeSize[u];
        }
}

int getCentroid(int v, int parent, int treeSize) {
    for (int u : adj[v])
        if (u != parent && !removed[u] && subtreeSize[u] > treeSize / 2)
            return getCentroid(u, v, treeSize);
    return v;
}

int decompose(int v, int depth) {
    getSubtreeSize(v, -1);
    int centroid = getCentroid(v, -1, subtreeSize[v]);
    removed[centroid] = true;

    int maxDepth = depth;
    for (int u : adj[centroid])
        if (!removed[u]) {
            int result = decompose(u, depth + 1);
            if (result > maxDepth) maxDepth = result;
        }

    removed[centroid] = false;
    return maxDepth;
}

int centroidDecomposition(const vector<int>& arr) {
    int idx = 0;
    int n = arr[idx++];
    if (n <= 1) return 0;

    adj.assign(n, vector<int>());
    int m = ((int)arr.size() - 1) / 2;
    for (int i = 0; i < m; i++) {
        int u = arr[idx++], v = arr[idx++];
        adj[u].push_back(v); adj[v].push_back(u);
    }

    removed.assign(n, false);
    subtreeSize.assign(n, 0);
    return decompose(0, 0);
}

int main() {
    cout << centroidDecomposition({4, 0, 1, 1, 2, 2, 3}) << endl;
    cout << centroidDecomposition({5, 0, 1, 0, 2, 0, 3, 0, 4}) << endl;
    cout << centroidDecomposition({1}) << endl;
    cout << centroidDecomposition({7, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6}) << endl;
    return 0;
}

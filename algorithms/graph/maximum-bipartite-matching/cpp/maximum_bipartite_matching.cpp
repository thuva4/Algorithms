#include <vector>
#include <cstring>
using namespace std;

static vector<vector<int>> adj_mbm;
static vector<int> matchRight_mbm;

static bool dfs_mbm(int u, vector<bool>& visited) {
    for (int v : adj_mbm[u]) {
        if (!visited[v]) {
            visited[v] = true;
            if (matchRight_mbm[v] == -1 || dfs_mbm(matchRight_mbm[v], visited)) {
                matchRight_mbm[v] = u;
                return true;
            }
        }
    }
    return false;
}

int maximum_bipartite_matching(vector<int> arr) {
    int nLeft = arr[0], nRight = arr[1], m = arr[2];
    adj_mbm.assign(nLeft, vector<int>());
    for (int i = 0; i < m; i++) {
        adj_mbm[arr[3 + 2 * i]].push_back(arr[3 + 2 * i + 1]);
    }
    matchRight_mbm.assign(nRight, -1);
    int result = 0;
    for (int u = 0; u < nLeft; u++) {
        vector<bool> visited(nRight, false);
        if (dfs_mbm(u, visited)) result++;
    }
    return result;
}

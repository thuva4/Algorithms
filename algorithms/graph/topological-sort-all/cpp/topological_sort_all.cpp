#include <vector>
using namespace std;

static vector<vector<int>> adj_ta;
static vector<int> inDeg_ta;
static vector<bool> visited_ta;
static int n_ta, count_ta;

static void backtrack(int placed) {
    if (placed == n_ta) { count_ta++; return; }
    for (int v = 0; v < n_ta; v++) {
        if (!visited_ta[v] && inDeg_ta[v] == 0) {
            visited_ta[v] = true;
            for (int w : adj_ta[v]) inDeg_ta[w]--;
            backtrack(placed + 1);
            visited_ta[v] = false;
            for (int w : adj_ta[v]) inDeg_ta[w]++;
        }
    }
}

int topological_sort_all(vector<int> arr) {
    n_ta = arr[0];
    int m = arr[1];
    adj_ta.assign(n_ta, vector<int>());
    inDeg_ta.assign(n_ta, 0);
    visited_ta.assign(n_ta, false);
    for (int i = 0; i < m; i++) {
        int u = arr[2 + 2 * i], v = arr[2 + 2 * i + 1];
        adj_ta[u].push_back(v);
        inDeg_ta[v]++;
    }
    count_ta = 0;
    backtrack(0);
    return count_ta;
}

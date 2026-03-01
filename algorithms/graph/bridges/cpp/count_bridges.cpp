#include <vector>
#include <algorithm>
using namespace std;

static int timer_val, bridge_count;
static vector<int> disc_val, low_val, par;
static vector<vector<int>> adj;

static void dfs(int u) {
    disc_val[u] = timer_val;
    low_val[u] = timer_val;
    timer_val++;

    for (int v : adj[u]) {
        if (disc_val[v] == -1) {
            par[v] = u;
            dfs(v);
            low_val[u] = min(low_val[u], low_val[v]);
            if (low_val[v] > disc_val[u]) bridge_count++;
        } else if (v != par[u]) {
            low_val[u] = min(low_val[u], disc_val[v]);
        }
    }
}

int count_bridges(vector<int> arr) {
    int n = arr[0];
    int m = arr[1];
    adj.assign(n, vector<int>());
    for (int i = 0; i < m; i++) {
        int u = arr[2 + 2 * i];
        int v = arr[2 + 2 * i + 1];
        adj[u].push_back(v);
        adj[v].push_back(u);
    }

    disc_val.assign(n, -1);
    low_val.assign(n, 0);
    par.assign(n, -1);
    timer_val = 0;
    bridge_count = 0;

    for (int i = 0; i < n; i++) {
        if (disc_val[i] == -1) dfs(i);
    }

    return bridge_count;
}

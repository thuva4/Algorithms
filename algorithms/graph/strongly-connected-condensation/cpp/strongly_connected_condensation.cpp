#include <vector>
#include <stack>
#include <algorithm>

using namespace std;

static int indexCounter, sccCount;
static vector<int> disc_scc, low_scc;
static vector<bool> onStack_scc;
static stack<int> st_scc;
static vector<vector<int>> adj_scc;

static void strongconnect(int v) {
    disc_scc[v] = indexCounter;
    low_scc[v] = indexCounter;
    indexCounter++;
    st_scc.push(v);
    onStack_scc[v] = true;

    for (int w : adj_scc[v]) {
        if (disc_scc[w] == -1) {
            strongconnect(w);
            low_scc[v] = min(low_scc[v], low_scc[w]);
        } else if (onStack_scc[w]) {
            low_scc[v] = min(low_scc[v], disc_scc[w]);
        }
    }

    if (low_scc[v] == disc_scc[v]) {
        sccCount++;
        while (true) {
            int w = st_scc.top(); st_scc.pop();
            onStack_scc[w] = false;
            if (w == v) break;
        }
    }
}

int strongly_connected_condensation(vector<int> arr) {
    int n = arr[0];
    int m = arr[1];
    adj_scc.assign(n, vector<int>());
    for (int i = 0; i < m; i++) {
        int u = arr[2 + 2 * i];
        int v = arr[2 + 2 * i + 1];
        adj_scc[u].push_back(v);
    }

    indexCounter = 0;
    sccCount = 0;
    disc_scc.assign(n, -1);
    low_scc.assign(n, 0);
    onStack_scc.assign(n, false);
    while (!st_scc.empty()) st_scc.pop();

    for (int v = 0; v < n; v++) {
        if (disc_scc[v] == -1) strongconnect(v);
    }

    return sccCount;
}

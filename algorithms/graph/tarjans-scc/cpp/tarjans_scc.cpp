#include <vector>
#include <stack>
#include <algorithm>

using namespace std;

static int indexCounter, sccCount;
static vector<int> disc, low;
static vector<bool> onStack;
static stack<int> st;
static vector<vector<int>> adj;

static void strongconnect(int v) {
    disc[v] = indexCounter;
    low[v] = indexCounter;
    indexCounter++;
    st.push(v);
    onStack[v] = true;

    for (int w : adj[v]) {
        if (disc[w] == -1) {
            strongconnect(w);
            low[v] = min(low[v], low[w]);
        } else if (onStack[w]) {
            low[v] = min(low[v], disc[w]);
        }
    }

    if (low[v] == disc[v]) {
        sccCount++;
        while (true) {
            int w = st.top();
            st.pop();
            onStack[w] = false;
            if (w == v) break;
        }
    }
}

int tarjans_scc(vector<int> arr) {
    int n = arr[0];
    int m = arr[1];
    adj.assign(n, vector<int>());
    for (int i = 0; i < m; i++) {
        int u = arr[2 + 2 * i];
        int v = arr[2 + 2 * i + 1];
        adj[u].push_back(v);
    }

    indexCounter = 0;
    sccCount = 0;
    disc.assign(n, -1);
    low.assign(n, 0);
    onStack.assign(n, false);
    while (!st.empty()) st.pop();

    for (int v = 0; v < n; v++) {
        if (disc[v] == -1) {
            strongconnect(v);
        }
    }

    return sccCount;
}

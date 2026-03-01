#include "two_sat.h"
#include <vector>
#include <cmath>
#include <algorithm>
#include <stack>

static std::vector<std::vector<int>> adj;
static std::vector<int> dfn, low, scc_id;
static std::vector<bool> in_stack;
static std::stack<int> st;
static int timer, scc_cnt;

static void tarjan(int u) {
    dfn[u] = low[u] = ++timer;
    st.push(u);
    in_stack[u] = true;

    for (int v : adj[u]) {
        if (!dfn[v]) {
            tarjan(v);
            low[u] = std::min(low[u], low[v]);
        } else if (in_stack[v]) {
            low[u] = std::min(low[u], dfn[v]);
        }
    }

    if (low[u] == dfn[u]) {
        scc_cnt++;
        int v;
        do {
            v = st.top();
            st.pop();
            in_stack[v] = false;
            scc_id[v] = scc_cnt;
        } while (u != v);
    }
}

int two_sat(const std::vector<int>& arr) {
    if (arr.size() < 2) return 0;
    int n = arr[0];
    int m = arr[1];
    
    if (arr.size() < 2 + 2 * m) return 0;

    int num_nodes = 2 * n;
    adj.assign(num_nodes, std::vector<int>());
    dfn.assign(num_nodes, 0);
    low.assign(num_nodes, 0);
    scc_id.assign(num_nodes, 0);
    in_stack.assign(num_nodes, false);
    while (!st.empty()) st.pop();
    timer = 0;
    scc_cnt = 0;

    for (int i = 0; i < m; i++) {
        int u_raw = arr[2 + 2 * i];
        int v_raw = arr[2 + 2 * i + 1];

        int u = (std::abs(u_raw) - 1) * 2 + (u_raw < 0 ? 1 : 0);
        int v = (std::abs(v_raw) - 1) * 2 + (v_raw < 0 ? 1 : 0);
        
        int not_u = u ^ 1;
        int not_v = v ^ 1;
        
        adj[not_u].push_back(v);
        adj[not_v].push_back(u);
    }

    for (int i = 0; i < num_nodes; i++) {
        if (!dfn[i]) tarjan(i);
    }

    for (int i = 0; i < n; i++) {
        if (scc_id[2 * i] == scc_id[2 * i + 1]) return 0;
    }

    return 1;
}

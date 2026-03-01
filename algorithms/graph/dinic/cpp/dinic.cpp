#include "dinic.h"
#include <vector>
#include <queue>
#include <algorithm>
#include <climits>

using namespace std;

struct Edge {
    int to;
    int rev;
    long long cap;
    long long flow;
};

static vector<vector<Edge>> adj;
static vector<int> level;
static vector<int> ptr;

static void add_edge(int u, int v, long long cap) {
    Edge a = {v, (int)adj[v].size(), cap, 0};
    Edge b = {u, (int)adj[u].size(), 0, 0};
    adj[u].push_back(a);
    adj[v].push_back(b);
}

static bool bfs(int s, int t) {
    fill(level.begin(), level.end(), -1);
    level[s] = 0;
    queue<int> q;
    q.push(s);
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        for (const auto& e : adj[u]) {
            if (e.cap - e.flow > 0 && level[e.to] == -1) {
                level[e.to] = level[u] + 1;
                q.push(e.to);
            }
        }
    }
    return level[t] != -1;
}

static long long dfs(int u, int t, long long pushed) {
    if (pushed == 0) return 0;
    if (u == t) return pushed;
    for (int& cid = ptr[u]; cid < adj[u].size(); ++cid) {
        auto& e = adj[u][cid];
        int v = e.to;
        if (level[u] + 1 != level[v] || e.cap - e.flow == 0) continue;
        long long tr = pushed;
        if (e.cap - e.flow < tr) tr = e.cap - e.flow;
        long long pushed_flow = dfs(v, t, tr);
        if (pushed_flow == 0) continue;
        e.flow += pushed_flow;
        adj[v][e.rev].flow -= pushed_flow;
        return pushed_flow;
    }
    return 0;
}

int dinic(const vector<int>& arr) {
    if (arr.size() < 4) return 0;
    int n = arr[0];
    int m = arr[1];
    int s = arr[2];
    int t = arr[3];
    
    if (arr.size() < 4 + 3 * m) return 0;
    
    adj.assign(n, vector<Edge>());
    level.resize(n);
    ptr.resize(n);
    
    for (int i = 0; i < m; i++) {
        int u = arr[4 + 3 * i];
        int v = arr[4 + 3 * i + 1];
        long long cap = arr[4 + 3 * i + 2];
        if (u >= 0 && u < n && v >= 0 && v < n) {
            add_edge(u, v, cap);
        }
    }
    
    long long flow = 0;
    while (bfs(s, t)) {
        fill(ptr.begin(), ptr.end(), 0);
        while (long long pushed = dfs(s, t, LLONG_MAX)) {
            flow += pushed;
        }
    }
    
    return (int)flow;
}

#include <vector>
#include <stack>
using namespace std;

static vector<vector<int>> adj_pb;
static vector<int> preorder_pb;
static int counter_pb, scc_count_pb;
static stack<int> sStack_pb, pStack_pb;
static vector<bool> assigned_pb;

static void dfs_pb(int v) {
    preorder_pb[v] = counter_pb++;
    sStack_pb.push(v);
    pStack_pb.push(v);

    for (int w : adj_pb[v]) {
        if (preorder_pb[w] == -1) {
            dfs_pb(w);
        } else if (!assigned_pb[w]) {
            while (preorder_pb[pStack_pb.top()] > preorder_pb[w]) pStack_pb.pop();
        }
    }

    if (!pStack_pb.empty() && pStack_pb.top() == v) {
        pStack_pb.pop();
        scc_count_pb++;
        while (true) {
            int u = sStack_pb.top(); sStack_pb.pop();
            assigned_pb[u] = true;
            if (u == v) break;
        }
    }
}

int strongly_connected_path_based(vector<int> arr) {
    int n = arr[0], m = arr[1];
    adj_pb.assign(n, vector<int>());
    for (int i = 0; i < m; i++) {
        adj_pb[arr[2 + 2 * i]].push_back(arr[2 + 2 * i + 1]);
    }
    preorder_pb.assign(n, -1);
    assigned_pb.assign(n, false);
    counter_pb = 0; scc_count_pb = 0;
    while (!sStack_pb.empty()) sStack_pb.pop();
    while (!pStack_pb.empty()) pStack_pb.pop();

    for (int v = 0; v < n; v++) {
        if (preorder_pb[v] == -1) dfs_pb(v);
    }
    return scc_count_pb;
}

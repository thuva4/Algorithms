#include <vector>
#include <queue>
#include <climits>
#include <cstring>
#include <algorithm>

using namespace std;

int network_flow_mincost(vector<int> arr) {
    int n = arr[0];
    int m = arr[1];
    int src = arr[2];
    int sink = arr[3];

    vector<int> head(n, -1), to, cap, cost, nxt;
    int edgeCnt = 0;

    auto addEdge = [&](int u, int v, int c, int w) {
        to.push_back(v); cap.push_back(c); cost.push_back(w); nxt.push_back(head[u]); head[u] = edgeCnt++;
        to.push_back(u); cap.push_back(0); cost.push_back(-w); nxt.push_back(head[v]); head[v] = edgeCnt++;
    };

    for (int i = 0; i < m; i++) {
        int u = arr[4 + 4 * i];
        int v = arr[4 + 4 * i + 1];
        int c = arr[4 + 4 * i + 2];
        int w = arr[4 + 4 * i + 3];
        addEdge(u, v, c, w);
    }

    int INF = INT_MAX / 2;
    int totalCost = 0;

    while (true) {
        vector<int> dist(n, INF);
        dist[src] = 0;
        vector<bool> inQueue(n, false);
        vector<int> prevEdge(n, -1), prevNode(n, -1);
        queue<int> q;
        q.push(src);
        inQueue[src] = true;

        while (!q.empty()) {
            int u = q.front(); q.pop();
            inQueue[u] = false;
            for (int e = head[u]; e != -1; e = nxt[e]) {
                int v = to[e];
                if (cap[e] > 0 && dist[u] + cost[e] < dist[v]) {
                    dist[v] = dist[u] + cost[e];
                    prevEdge[v] = e;
                    prevNode[v] = u;
                    if (!inQueue[v]) {
                        q.push(v);
                        inQueue[v] = true;
                    }
                }
            }
        }

        if (dist[sink] == INF) break;

        int bottleneck = INF;
        for (int v = sink; v != src; v = prevNode[v]) {
            bottleneck = min(bottleneck, cap[prevEdge[v]]);
        }

        for (int v = sink; v != src; v = prevNode[v]) {
            int e = prevEdge[v];
            cap[e] -= bottleneck;
            cap[e ^ 1] += bottleneck;
        }

        totalCost += bottleneck * dist[sink];
    }

    return totalCost;
}

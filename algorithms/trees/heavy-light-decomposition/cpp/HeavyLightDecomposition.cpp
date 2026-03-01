#include <stdio.h>
#include <math.h>
#include <string.h>
#include <time.h>
#include <iostream>
#include <vector>
#include <list>
#include <string>
#include <algorithm>
#include <queue>
#include <stack>
#include <set>
#include <map>
#include <complex>
#define MAX_N 1000001
#define INF 987654321
using namespace std;
typedef long long lld;
typedef unsigned long long llu;

/*
 Heavy-Light Decomposition algorithm for partitioning the edges of a tree into two groups - heavy and light.
 Can be used for efficient traversal from any node to the root of the tree, since there are at most log n light edges
 along that path; hence, we can skip entire chains of heavy edges.
 Complexity: O(n)
*/

struct Node
{
     vector<int> adj;
};
Node graf[MAX_N];

struct TreeNode
{
     int parent;
     int depth;
     int chainTop;
     int subTreeSize;
};
TreeNode T[MAX_N];

int DFS(int root, int parent, int depth)
{
     T[root].parent = parent;
     T[root].depth = depth;
     T[root].subTreeSize = 1;
     for (int i=0;i<graf[root].adj.size();i++)
     {
          int xt = graf[root].adj[i];
          if (xt == parent) continue;
          T[root].subTreeSize += DFS(xt, root, depth+1);
     }
     return T[root].subTreeSize;
}

void HLD(int root, int parent, int chainTop)
{
     T[root].chainTop = chainTop;
     
     for (int i=0;i<graf[root].adj.size();i++)
     {
          int xt = graf[root].adj[i];
          if (xt == parent) continue;
          if (T[xt].subTreeSize*1.0 > T[root].subTreeSize*0.5) HLD(xt, root, chainTop);
          else HLD(xt, root, xt);
     }
}

inline int LCA(int u, int v)
{
     while (T[u].chainTop != T[v].chainTop)
     {
          if (T[T[u].chainTop].depth < T[T[v].chainTop].depth) v = T[T[v].chainTop].parent;
          else u = T[T[u].chainTop].parent;
     }
     
     if (T[u].depth < T[v].depth) return u;
     else return v;
}

int n;

int main()
{
     n = 7;
     
     graf[1].adj.push_back(2);
     graf[2].adj.push_back(1);
     
     graf[1].adj.push_back(3);
     graf[3].adj.push_back(1);
     
     graf[1].adj.push_back(4);
     graf[4].adj.push_back(1);
     
     graf[3].adj.push_back(5);
     graf[5].adj.push_back(3);
     
     graf[3].adj.push_back(6);
     graf[6].adj.push_back(3);
     
     graf[3].adj.push_back(7);
     graf[7].adj.push_back(3);
     
     DFS(1, 1, 0);
     HLD(1, 1, 1);
     
     printf("%d\n", LCA(5, 7));
     printf("%d\n", LCA(2, 7));
     
     return 0;
}
#include <algorithm>
#include <queue>
#include <string>
#include <vector>

namespace {

void build_tree(
    int n,
    const std::vector<std::vector<int>>& edges,
    std::vector<int>& parent,
    std::vector<int>& depth
) {
    std::vector<std::vector<int>> graph(n);
    for (const std::vector<int>& edge : edges) {
        if (edge.size() != 2) {
            continue;
        }
        graph[edge[0]].push_back(edge[1]);
        graph[edge[1]].push_back(edge[0]);
    }

    std::queue<int> queue;
    queue.push(0);
    parent[0] = 0;
    while (!queue.empty()) {
        int node = queue.front();
        queue.pop();
        for (int next : graph[node]) {
            if (next == parent[node]) {
                continue;
            }
            parent[next] = node;
            depth[next] = depth[node] + 1;
            queue.push(next);
        }
    }
}

std::vector<int> collect_path(int u, int v, const std::vector<int>& parent, const std::vector<int>& depth) {
    std::vector<int> left;
    std::vector<int> right;
    int a = u;
    int b = v;

    while (depth[a] > depth[b]) {
        left.push_back(a);
        a = parent[a];
    }
    while (depth[b] > depth[a]) {
        right.push_back(b);
        b = parent[b];
    }
    while (a != b) {
        left.push_back(a);
        right.push_back(b);
        a = parent[a];
        b = parent[b];
    }
    left.push_back(a);
    std::reverse(right.begin(), right.end());
    left.insert(left.end(), right.begin(), right.end());
    return left;
}

}  // namespace

std::vector<int> hld_path_query(
    int n,
    const std::vector<std::vector<int>>& edges,
    const std::vector<int>& values,
    const std::vector<std::vector<std::string>>& queries
) {
    std::vector<int> parent(n, -1);
    std::vector<int> depth(n, 0);
    build_tree(n, edges, parent, depth);

    std::vector<int> result;
    for (const std::vector<std::string>& query : queries) {
        if (query.size() < 3) {
            continue;
        }
        int u = std::stoi(query[1]);
        int v = std::stoi(query[2]);
        std::vector<int> path = collect_path(u, v, parent, depth);
        if (query[0] == "sum") {
            int total = 0;
            for (int node : path) {
                total += values[node];
            }
            result.push_back(total);
        } else if (query[0] == "max") {
            int best = values[path[0]];
            for (int node : path) {
                best = std::max(best, values[node]);
            }
            result.push_back(best);
        }
    }

    return result;
}

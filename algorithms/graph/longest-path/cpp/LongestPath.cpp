#include<bits/stdc++.h>
using namespace std;
vector<vector<int>> g;
int dist[1000006];
int vis[1000006];
int bfs(int source){ // returns furthest node from source node
	memset(vis,0,sizeof(vis));
	memset(dist,0,sizeof(dist));
	queue<int> q;
	q.push(source);
	int last=source;
	while(!q.empty()){
		int front=q.front(); 
		q.pop();
		if(vis[front]) continue;
		last=front;
		for(auto i : g[front]){
			if(vis[i]) continue;
			dist[i]=dist[front]+1;
			q.push(i);
		}
	}
	return last;
}
int longest_path(int nodes,int edges){ // returns length of longest path
	int source=bfs(1);
	return dist[bfs(source)];
}
int main(){
	int nodes,edges;
	cin>>nodes>>edges;
	g.resize(nodes+1);
	for(int i=0;i<edges;i++){
		int u,v;
		cin>>u>>v;
		g[u].push_back(v);
		g[v].push_back(u);
	}
	int ans=longest_path(nodes,edges);
	cout<<ans<<endl;
}
#include <algorithm>
#include <queue>
#include <string>
#include <vector>

std::vector<std::string> longest_path(
    const std::vector<std::vector<std::vector<int>>>& weighted_adjacency_list,
    int start_node
) {
    const long long neg_inf = -(1LL << 60);
    int n = static_cast<int>(weighted_adjacency_list.size());
    std::vector<int> indegree(n, 0);
    for (const auto& edges : weighted_adjacency_list) {
        for (const auto& edge : edges) {
            if (edge.size() == 2) {
                ++indegree[edge[0]];
            }
        }
    }

    std::queue<int> queue;
    for (int node = 0; node < n; ++node) {
        if (indegree[node] == 0) {
            queue.push(node);
        }
    }

    std::vector<int> order;
    while (!queue.empty()) {
        int node = queue.front();
        queue.pop();
        order.push_back(node);
        for (const auto& edge : weighted_adjacency_list[node]) {
            if (--indegree[edge[0]] == 0) {
                queue.push(edge[0]);
            }
        }
    }

    std::vector<long long> dist(n, neg_inf);
    if (start_node >= 0 && start_node < n) {
        dist[start_node] = 0;
    }
    for (int node : order) {
        if (dist[node] == neg_inf) {
            continue;
        }
        for (const auto& edge : weighted_adjacency_list[node]) {
            if (edge.size() != 2) {
                continue;
            }
            int next = edge[0];
            int weight = edge[1];
            dist[next] = std::max(dist[next], dist[node] + weight);
        }
    }

    std::vector<std::string> result;
    result.reserve(n);
    for (long long value : dist) {
        result.push_back(value == neg_inf ? "-Infinity" : std::to_string(value));
    }
    return result;
}

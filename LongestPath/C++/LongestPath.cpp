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

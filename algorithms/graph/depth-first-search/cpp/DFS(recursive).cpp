#include<bits/stdc++.h>

using namespace std;

vector<int> adj[1000];            //adjacency list of graph
bool visited[1000]={false} ;               //array to keep track of visited nodes

void dfs(int source)
{
    visited[source] = true;

    for(int i=0; i<adj[source].size() ;i++)      //visiting neighbours of source vertex
    {
       int neighbour = adj[source][i];
        if( !visited[neighbour])
        {
            dfs(neighbour);
        }

    }


}

int main()
{
    int vertices,edges;
    cin>>vertices>>edges;

    for(int i=0; i<edges ; i++)
    {
        int u,v;
        cin>>u>>v;
        adj[u].push_back(v);
        adj[v].push_back(u);
    }

    int source;
    cin>>source;

    dfs(source);

    return 0;
}

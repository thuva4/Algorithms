#include <iostream>
#include <bits/stdc++.h>
using namespace std;

vector <int> v[100001];                 // to store the original graph
bool vis[100001]={false};     // to keep track of visited vertices
vector <int> components[100001];     // to label and store different connected components
int label[100001];

void dfs(int s, int subgraph_no)
 {
        vis[s] = true;
        components[subgraph_no].push_back(s);
        label[s]=subgraph_no;           // assigning the component id or label to the vertex
        for(int i = 0;i < v[s].size();++i)
        {
         if(!vis[v[s][i]])
              dfs(v[s][i],subgraph_no);
        }
}

int main()
{
   int n,m,a,b,sub=1;   // sub labels the different connected components, initially we consider it to be 1
   cin>>n>>m;        // n is the number of vertices and m is the number of edges
   while(m--)
   {
       cin>>a>>b;
       v[a].push_back(b);
       v[b].push_back(a);
   }
   for(int i=1;i<=n;i++)            // to store different connected compoents using dfs
   {
       if(!vis[i])
        {
       dfs(i,sub);
       sub++;
        }
   }
   return 0;
}

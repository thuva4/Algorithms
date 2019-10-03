#include <iostream>
#include <algorithm>
using namespace std;

class Edge
{
  public:
  int source;
  int dest;
  int weight;
};

bool compare(Edge E1, Edge E2)
{
  return E1.weight < E2.weight;
}

int findParent(int v, int *parent)
{
  if(parent[v]==v)
    return v;
  return findParent(parent[v], parent);
}

void kruskals(Edge *input, int V, int E)
{
  sort(input, input+E, compare);
  Edge *output=new Edge[V-1];
  int *parent=new int[V];
  
  for(int i=0;i<V;i++)
  {
    parent[i]=i;  
  }
  
  int count=0;
  int i=0;
  while(count!=V-1)
  {
    Edge currentEdge=input[i];
    int sourceParent=findParent(currentEdge.source, parent);
    int destParent=findParent(currentEdge.dest, parent);
    if(sourceParent!=destParent)
    {
      output[count]=currentEdge;
      count++;
      parent[sourceParent]=destParent;
      
    }
    i++;
  }
  for(int i=0;i<V-1;i++)
  {
    if(output[i].source < output[i].dest)
      cout<<output[i].source<<" "<<output[i].dest<<" "<<output[i].weight<<endl;
    else
      cout<<output[i].dest<<" "<<output[i].source<<" "<<output[i].weight<<endl;
  }
}

int main()
{
  int V, E, tempX, tempY;
  cin >> V >> E;
  Edge *input=new Edge[E];
  for(int i=0;i<E;i++)
  {
    int S,D,W;
    cin>>S>>D>>W;
    input[i].source=S;
    input[i].dest=D;
    input[i].weight=W;
  }
  kruskals(input, V, E);
  return 0;
}

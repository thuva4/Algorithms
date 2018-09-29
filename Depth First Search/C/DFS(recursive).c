#include<stdio.h>
#include <stdbool.h>

#define MAXNODES 1000 // Max number of nodes

bool graphmat[MAXNODES][MAXNODES];            //graph matrix
bool isvisited[MAXNODES];               //array to keep track of visited nodes

void dfs(int source)
{
    isvisited[source] = true;
    for(int i=0; i<MAXNODES ;i++)      //visiting neighbours of source vertex
    {
        if(graphmat[source][i] && !isvisited[i])
        {
            dfs(i);
        }
    }
}

int main()
{
    int vertices,edges;
    scanf("%d %d",&vertices,&edges);
    for(int i=0; i<edges ; i++)
    {
        int from,to;
        scanf("%d %d",&from,&to);
        graphmat[from][to] = true;
    }
    int source;
    scanf("%d",&source);
    dfs(source);
    return 0;
}

#include <iostream>
#include <algorithm>
using namespace std; 
int main()
{
	int i, j, v, e, min, x;
 
	cout<<"Enter the total number of vertexes of the tree:\n";
	cin>>v;
	e = v-1;
	int deg[v+1];
	int edge[e][2]; 
     for(i=0;i<=v+1;i++){
     	deg[i]=0;
     }
	cout<<"\nFor "<<v<<" vertexes this connected tree must have exactly "<<e<<" edges.\n";

	cout<<"\nEnter "<<e<<" pair of vertexes for the tree.\n";
	for(i = 0; i < e; i++)
	{
		cout<<"Enter the vertex pair for edge "<<i+1<<":";
		cout<<"\nV(1): ";
		cin>>edge[i][0];
		cout<<"V(2): ";
		cin>>edge[i][1];
 
		deg[edge[i][0]]++;
		deg[edge[i][1]]++;
	}
	cout<<"\nThe Prufer code for the given tree is: { ";
	for(i = 0; i < v-2; i++)
	{
		min = 10000;
		for(j = 0; j < e; j++)
		{
			if(deg[edge[j][0]] == 1)
			{
				if(min > edge[j][0])
				{
					min = edge[j][0];
					x = j;
				}
			}
			if(deg[edge[j][1]] == 1)
			{
				if(min > edge[j][1])
				{
					min = edge[j][1];
					x = j;
				}
			}
		}

		deg[edge[x][0]]--;

		deg[edge[x][1]]--;

		if(deg[edge[x][0]] == 0)
			cout<<edge[x][1]<<" ";
		else
			cout<<edge[x][0]<<" ";	
	}
	cout<<"}";
 
	return 0;
}

#define _CRT_SECURE_NO_WARNINGS
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#define MAX 999999999
struct edge
{
	int start;
	int end;
	int weight;
};

struct Graph
{
	int V;
	int E;
	struct edge* Edge;
};

struct Graph* create_Graph(int _V, int _E)
{
	struct Graph* G = (struct Graph*)malloc(sizeof(struct Graph));
	G->V = _V;
	G->E = _E;

	G->Edge = (struct edge*)malloc(sizeof(struct edge) * G->E);

	return G;
}

void Bellman_Ford(struct Graph* G, int starting_point)
{
	int v = G->V;
	int e = G->E;

	int *distance = (int *)malloc(sizeof(int) * v + 1);
	for (int i = 0; i <= v; i++) {
		//setup distance INF from starting point
		distance[i] = MAX;
	}
	//starting point's distance is zero
	distance[starting_point] = 0;

	//Relax edges V-1 times
	//if original distance is longer than 
	//distance from source node + weight, then update.
	for (int i = 0; i < v - 1; i++)
	{
		for (int j = 0; j < e; j++)
		{
			int u = G->Edge[j].start;
			int v = G->Edge[j].end;
			int w = G->Edge[j].weight;
			if ((distance[u] != MAX) && (distance[v] > distance[u] + w))
			{
				distance[v] = distance[u] + w;
			}
		}
	}
	int neg_cycle = 0;
	//If be relaxed here, there is negative cycle
	for (int j = 0; j < e; j++) {
		int u = G->Edge[j].start;
		int v = G->Edge[j].end;
		int w = G->Edge[j].weight;

		//negative cycle is represented as -1	
		if ((distance[u] != MAX) && (distance[v] > distance[u] + w))
		{
			distance[v] = -1;
			neg_cycle = 1;
		}

	}


	if (neg_cycle == 1)
		printf("-1\n");
	else {
		for (int i = 2; i <= v; i++)
		{
			if (i != starting_point)
			{
				if (distance[i] == MAX)
				{
					printf("-1\n");
				}
				else
				{
					printf("%d\n", distance[i]);
				}
			}
		}
	}
}


int main() {
	//How many inputs will be there 
	//N = vertices, M = edges
	int N, M;
	scanf("%d %d", &N, &M);
	struct Graph* graph = create_Graph(N, M);
	int start, end, weight;
	for (int i = 0; i < M; i++)
	{
		scanf("%d %d %d", &start, &end, &weight);
		graph->Edge[i].start = start;
		graph->Edge[i].end = end;
		graph->Edge[i].weight = weight;
	}
	int Starting_point = 1;
	Bellman_Ford(graph, Starting_point);


}




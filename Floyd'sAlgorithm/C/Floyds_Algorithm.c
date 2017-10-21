#include <stdio.h>
#define N 501
#define ll long long 
#define INF 10000000011

ll dist[N][N];

int main() {
	printf("Enter the number of vertices and edges : \n");
	ll n, m, i, j; scanf("%lld %lld", &n, &m);
	for(i = 1 ; i <= n ; i++)
		for(j = 1 ; j <= n ; j++)
			dist[i][j] = INF;
	for(i = 1 ; i <= n ; i++) 
		dist[i][i] = 0;
	ll x, y, z;
	printf("Enter the edge parameters as - start_vertex end_vertex weight\n");
	for(int i = 1 ; i <= m ; i++) {
		scanf("%lld %lld %lld", &x, &y, &z);
		if(dist[x][y] == INF) dist[x][y] = z;
		else if(dist[x][y] > z) dist[x][y] = z;
	}
	int k;
	for(k = 1 ; k <= n ; k++)
		for(i = 1 ; i <= n ; i++)
			for(j = 1 ; j <= n ; j++)
				if(dist[i][j] > dist[i][k] + dist[k][j]) 
					dist[i][j] = dist[i][k] + dist[k][j];
	printf("The shortest distance between each pair of vertices i, j is given by the value of cell(i, j) of the following matrix:\n");
	for(i = 1 ; i <= n ; i++) {
		for(j = 1 ; j <= m ; j++)
			if(dist[i][j] == INF)
				printf("INF ");
			else
				printf("%lld ", dist[i][j]);
		printf("\n");
	}				
	return 0;
}

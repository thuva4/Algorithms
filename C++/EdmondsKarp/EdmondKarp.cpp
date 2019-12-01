#define _CRT_SECURE_NO_WARNINGS
#include <iostream>
#include <queue>
#include <vector>

using namespace std;

#define MAX 52 // Node [A-Z], [a-z]  : 52 characters.
#define INF 999999999

vector<int> edge[MAX];
int result;
int capa[MAX][MAX], f[MAX][MAX], d[MAX];
//capa = Total capacity from i to j in capa[i][j]
//f = amount of flow in current situation from i to j in f[i][j]

void EdmondKarp(int start, int end) {
	result = 0;
	while (1) {
	//Find all possible ways
		fill(d, d + MAX, -1);
		queue<int> q;
		q.push(start);
		while (!q.empty()) {
			int x = q.front();
			q.pop();
			//performing BFS
			for (int i = 0; i < edge[x].size();i++) { 
				int y = edge[x][i];
				if (capa[x][y] - f[x][y] > 0 && d[y] == -1) {
					//if capacity left and not visited 
					q.push(y);
					d[y] = x;
					if (y == end) break;
				}
			}
		}
		if (d[end] == -1) break;
		//If not found possible way with BFS ==> No more ways.
		int flow = INF;
		for (int i = end; i != start; i = d[i]) {
			flow = min(flow, capa[d[i]][i] - f[d[i]][i]);
		}

		for (int i = end; i != start; i = d[i]) {
			f[d[i]][i] += flow;
			f[i][d[i]] -= flow;
		}
		result += flow;
	}
	printf("%d\n", result);
}


int translate(char c) {
	int ret;
	if (c >= 97) {
		ret = c - 97;
		ret += 26;
	}
	else {
		ret = c - 65;
	}
	return ret;
}


int main() {
	int N, amount;
	char p1, p2;
	//Number of Pipes
	scanf("%d", &N); 
	for (int i = 0; i < N; i++) {
		//Pipe from p1 to p2 has capacity of amount.
		cin >> p1 >> p2 >> amount;
		int _p1 = translate(p1);
		int _p2 = translate(p2);

		edge[_p1].push_back(_p2);
		edge[_p2].push_back(_p1);
		capa[_p1][_p2] += amount;
		capa[_p2][_p1] += amount;
		//============================
		//If Do this way, don't work properly in some cases.
		//Use the function 'translate'
		//edge[p1 - 65].push_back(p2-65);
		//edge[p2 - 65].push_back(p1-65);
		//capa[p1 - 65][p2 - 65] = amount;
		//capa[p2 - 65][p1 - 65] = amount;
		//=============================
	}

	EdmondKarp('A'-65, 'Z'-65);

}



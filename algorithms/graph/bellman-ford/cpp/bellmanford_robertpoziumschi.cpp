#include <stdio.h>
#include <vector>
#include <queue>
#include <algorithm>
#include <iostream>
#include <unordered_set>

#define NMax 100010
#define INF 9999
using namespace std;

int N, M;
int Parent[NMax];
vector<pair<int,int>> G[NMax];
vector<int> distances;
vector<pair<int,int>> edges;
vector<int> costs;

void bellman(int N, const vector<pair<int,int>> ad[NMax]) {
    distances.push_back(0);
    // Initialize costs from source to other nodes (neighbours and non-neighbours)
    // Non-neighbours
    for (int i = 1; i < N; i++) {
        distances.push_back(INF);
    }
    // Neighbours
    for(pair<int, int> neighbour: ad[0]) {
        distances[neighbour.first] = neighbour.second;
    }

    // Relax edges |E|*(|V|-1) times
    for(int i = 1; i <= N - 1; i++) {
        int j = 0;
        for(pair<int, int> edge: edges) {
            if(distances[edge.second] > distances[edge.first] + costs[j]){
                distances[edge.second] = distances[edge.first] + costs[j];
            }
            j++;
        }

    }

    int j = 0;
    // If we can relax one more time edges, then we have a cycle
    for(pair<int, int> edge: edges) {
        if(distances[edge.second] > distances[edge.first] + costs[j]){
            cout << "Cycle!\n";
             exit(-1);
        }
        j++;
    }

}

void Print( int N, const vector<pair<int,int>> ad[NMax], int* Parent ) {

    for (int i = 0; i < distances.size(); i++) {
        cout << distances[i] << " ";
    }

}

int main() {
    freopen("bellman.in", "r", stdin);
    freopen("bellman.out", "w", stdout);

    scanf("%d%d", &N, &M);

    while ( M -- ) {
        int x, y, cost;
        scanf("%d%d%d", &x, &y, &cost);
        G[x].push_back(make_pair(y, cost));
        G[y].push_back(make_pair(x, cost));
        edges.push_back(make_pair(x,y));

        costs.push_back(cost);
    }

    bellman(N, G);

    Print(N, G, Parent);

    return 0;
}
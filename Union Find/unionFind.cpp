/*
 * Matheus Oliveira
 * 29/10/2017
 * unionFind.cpp
 * 
 * Algorithm of Union Find optimized using Dynamic Programming and Rank of sets.
 * 
*/

#include <iostream>
#define MAXN 1000000

int rank[MAXN], parents[MAXN];

void initialize(int parents[], int rank[], int n) {
	int i;
	for(i=0; i < n; i++) {
		rank[i] = 0;
		parents[i] = i;
	}
}

int find(int node) {
	// function used to find parent(set) of current node.
	if(parents[node] == node) return node;
	return parents[node] = find(parents[node]);
}

void join(int node1, int node2) {
	int set1 = find(node1);
	int set2 = find(node2);

	// node1 and node2 belongs to the same set. Cycle found.
	if(set1 == set2) return;

	if(rank[set1] > rank[set2]) parents[set2] = set1;
	else if(rank[set2] > rank[set1]) parents[set1] = set2;
	else {	
		parents[set2] = set1;
		rank[set1]++;
	}
}

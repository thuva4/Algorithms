#define _CRT_SECURE_NO_WARNINGS

#include <stdio.h>
#include <stdlib.h>

int VertexSet[20001][2];
typedef struct Heap {
	int *data;
	int capacity;
	int usedsize;
}Heap;

static int edge[20001][20001];
Heap *H;

Heap* Create(int initsize) {
	Heap* NewHeap = (Heap *)malloc(sizeof(Heap));
	NewHeap->capacity = initsize;
	NewHeap->usedsize = 0;
	NewHeap->data = (int*)malloc(sizeof(int) * NewHeap->capacity);
	return NewHeap;
}

int getParent(int index) {
	return (int)((index - 1) / 2);
}

int getLeftChild(int index) {
	return (2 * index) + 1;
}

int getRightChild(int index) {
	return (2 * index) + 2;
}
void Swap(int index1, int index2) {
	int temp = H->data[index1];
	H->data[index1] = H->data[index2];
	H->data[index2] = temp;
}

void Insert(int newdata) {
	int curindex = H->usedsize;
	int parindex = getParent(curindex);
	//if (H->usedsize == H->capacity) {
	//	H->capacity *= 2;
//		H->data = (int *)realloc(H->data, sizeof(int) * H->capacity);
	//}
	H->data[curindex] = newdata;

	while (curindex > 0 && (H->data[curindex]) < (H->data[parindex])) {
		Swap(curindex, parindex);

		curindex = parindex;
		parindex = getParent(curindex);
	}
	H->usedsize++;

}

int Delete() {
	int parindex = 0;
	int lchildindex = 0;
	int rchildindex = 0;
	int mini = H->data[0];
	H->data[0] = 0;
	H->usedsize--;
	Swap(0, H->usedsize);

	lchildindex = getLeftChild(0);
	rchildindex = getRightChild(0);

	while (1) {
		int selectchildindex = 0;

		if (lchildindex >= H->usedsize)
			break;
		if (rchildindex >= H->usedsize)
			selectchildindex = lchildindex;
		else {
			if (H->data[lchildindex] > H->data[rchildindex])
				selectchildindex = rchildindex;
			else
				selectchildindex = lchildindex;
		}

		if (H->data[selectchildindex] < H->data[parindex]) {
			Swap(parindex, selectchildindex);
			parindex = selectchildindex;
		}
		else
			break;;

		lchildindex = getLeftChild(parindex);
		rchildindex = getRightChild(parindex);

	}
	return mini;
}



void Relax(int u, int v, int w) {
	int status = 0;
	if (VertexSet[v][0] > VertexSet[u][0] + w) {
		VertexSet[v][0] = VertexSet[u][0] + w;
		VertexSet[v][1] = u;
		status = 1;
	}
	if (status)Insert(v);
}



void Dijkstra(int S,int V) {
	for (int i = 0; i <= V; i++) {
		VertexSet[i][0] = 999999999;
		VertexSet[i][1] = 0;
	}
	VertexSet[S][0] = 0;
	
	int *set = (int *)malloc(sizeof(int)*V+1);
	

	int count = 1;
	set[0] = 0;
	Insert(S);

	
	//printf("%d", H->usedsize);
	while (H->usedsize != 0) {
		int u;
		u = Delete();
		set[count] = u;
		count++;
		for (int i = 1; i <= V; i++) {
			if(u != i)
				Relax(u, i, edge[u][i]);
		}

	}
	
	for (int i = 1; i <= V; i++) {
		if (i == S) printf("0\n");
		else if (VertexSet[i][0] == 99999999) printf("INF\n");
		else printf("%d\n", VertexSet[i][0]);
	}

}

int main() {
	
	//edge[20001][20001] = { 0, };
	int V, E, S, u, v, w; // V = # of vertex, E = # of edges
	
	scanf("%d %d %d", &V, &E, &S);
	for (int i = 0; i <= V; i++) {
		for (int j = 0; j <= V; j++) {
			edge[i][j] = 99999999;
		}
	}
	H = Create(V+1);
	for (int i = 0; i < E; i++) {
		scanf("%d %d %d",&u,&v,&w);//w is weight between u and v
		edge[u][v] = w;

	}
	Dijkstra(S, V);

}


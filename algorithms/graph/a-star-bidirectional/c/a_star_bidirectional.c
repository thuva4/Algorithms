#include "a_star_bidirectional.h"
#include <stdlib.h>
#include <stdio.h>
#include <stdbool.h>
#include <limits.h>

#define MAX_SIZE 10000 // Adjust if needed

typedef struct {
    int r, c;
    int f, g;
} Node;

typedef struct {
    Node* nodes;
    int size;
    int capacity;
} MinHeap;

static MinHeap* createHeap(int capacity) {
    MinHeap* h = (MinHeap*)malloc(sizeof(MinHeap));
    h->nodes = (Node*)malloc(capacity * sizeof(Node));
    h->size = 0;
    h->capacity = capacity;
    return h;
}

static void push(MinHeap* h, Node n) {
    if (h->size == h->capacity) return; // Expand if necessary
    int i = h->size++;
    while (i > 0) {
        int p = (i - 1) / 2;
        if (h->nodes[p].f <= n.f) break;
        h->nodes[i] = h->nodes[p];
        i = p;
    }
    h->nodes[i] = n;
}

static Node pop(MinHeap* h) {
    Node ret = h->nodes[0];
    Node last = h->nodes[--h->size];
    int i = 0;
    while (i * 2 + 1 < h->size) {
        int child = i * 2 + 1;
        if (child + 1 < h->size && h->nodes[child + 1].f < h->nodes[child].f) {
            child++;
        }
        if (last.f <= h->nodes[child].f) break;
        h->nodes[i] = h->nodes[child];
        i = child;
    }
    h->nodes[i] = last;
    return ret;
}

static int abs_val(int x) { return x < 0 ? -x : x; }

static int heuristic(int r1, int c1, int r2, int c2) {
    return abs_val(r1 - r2) + abs_val(c1 - c2);
}

int a_star_bidirectional(int arr[], int size) {
    if (size < 7) return -1;
    
    int rows = arr[0];
    int cols = arr[1];
    int sr = arr[2], sc = arr[3];
    int er = arr[4], ec = arr[5];
    int num_obs = arr[6];
    
    if (size < 7 + 2 * num_obs) return -1;
    
    // Check bounds
    if (sr < 0 || sr >= rows || sc < 0 || sc >= cols || er < 0 || er >= rows || ec < 0 || ec >= cols) return -1;
    if (sr == er && sc == ec) return 0;

    int* grid = (int*)calloc(rows * cols, sizeof(int)); // 0: free, 1: obstacle
    for (int i = 0; i < num_obs; i++) {
        int r = arr[7 + 2 * i];
        int c = arr[7 + 2 * i + 1];
        if (r >= 0 && r < rows && c >= 0 && c < cols) {
            grid[r * cols + c] = 1;
        }
    }
    
    if (grid[sr * cols + sc] || grid[er * cols + ec]) {
        free(grid);
        return -1;
    }

    MinHeap* openF = createHeap(rows * cols);
    MinHeap* openB = createHeap(rows * cols);
    
    int* gF = (int*)malloc(rows * cols * sizeof(int));
    int* gB = (int*)malloc(rows * cols * sizeof(int));
    
    for (int i = 0; i < rows * cols; i++) {
        gF[i] = INT_MAX;
        gB[i] = INT_MAX;
    }
    
    gF[sr * cols + sc] = 0;
    gB[er * cols + ec] = 0;
    
    Node startNode = {sr, sc, heuristic(sr, sc, er, ec), 0};
    push(openF, startNode);
    
    Node endNode = {er, ec, heuristic(er, ec, sr, sc), 0};
    push(openB, endNode);
    
    int bestPath = INT_MAX;
    int dr[] = {-1, 1, 0, 0};
    int dc[] = {0, 0, -1, 1};
    
    // Visited sets could be implemented via g-values being != INT_MAX
    // But to know if 'closed', we typically just check if popped g > current g.
    
    while (openF->size > 0 && openB->size > 0) {
        // Expand Forward
        if (openF->size > 0) {
            Node u = pop(openF);
            if (u.g > gF[u.r * cols + u.c]) continue;
            
            // Optimization: if gF[u] + gB[u] >= bestPath, maybe prune? 
            // Only if we found a path already.
            
            for (int i = 0; i < 4; i++) {
                int nr = u.r + dr[i];
                int nc = u.c + dc[i];
                
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr * cols + nc] == 0) {
                    int newG = u.g + 1;
                    if (newG < gF[nr * cols + nc]) {
                        gF[nr * cols + nc] = newG;
                        int h = heuristic(nr, nc, er, ec);
                        Node next = {nr, nc, newG + h, newG};
                        push(openF, next);
                        
                        if (gB[nr * cols + nc] != INT_MAX) {
                            if (newG + gB[nr * cols + nc] < bestPath) {
                                bestPath = newG + gB[nr * cols + nc];
                            }
                        }
                    }
                }
            }
        }
        
        // Expand Backward
        if (openB->size > 0) {
            Node u = pop(openB);
            if (u.g > gB[u.r * cols + u.c]) continue;
            
            for (int i = 0; i < 4; i++) {
                int nr = u.r + dr[i];
                int nc = u.c + dc[i];
                
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr * cols + nc] == 0) {
                    int newG = u.g + 1;
                    if (newG < gB[nr * cols + nc]) {
                        gB[nr * cols + nc] = newG;
                        int h = heuristic(nr, nc, sr, sc);
                        Node next = {nr, nc, newG + h, newG};
                        push(openB, next);
                        
                        if (gF[nr * cols + nc] != INT_MAX) {
                            if (newG + gF[nr * cols + nc] < bestPath) {
                                bestPath = newG + gF[nr * cols + nc];
                            }
                        }
                    }
                }
            }
        }
        
        // Termination logic for bidirectional A* is complex for optimality.
        // But for this problem (unweighted graph), simply checking meet point is usually enough
        // or check if min(openF.f) + min(openB.f) >= bestPath (standard condition).
        
        int minF = (openF->size > 0) ? openF->nodes[0].f : INT_MAX;
        int minB = (openB->size > 0) ? openB->nodes[0].f : INT_MAX;
        
        if (bestPath != INT_MAX && minF + minB >= bestPath) {
             // Heuristic consistency might allow early exit? 
             // With consistent heuristic, we can stop.
             break;
        }
    }
    
    free(grid);
    free(gF);
    free(gB);
    free(openF->nodes); free(openF);
    free(openB->nodes); free(openB);
    
    return bestPath == INT_MAX ? -1 : bestPath;
}

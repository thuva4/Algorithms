#ifndef BEST_FIRST_SEARCH_H
#define BEST_FIRST_SEARCH_H

#include <stdbool.h>

// Returns true if path found, false otherwise.
// n: number of nodes
// adj: adjacency matrix (n x n)
// start: start node index
// target: target node index
// heuristic: array of heuristic values for each node
// path: output array for path (needs to be allocated by caller, max size n)
// path_len: output length of path
bool best_first_search(int n, int** adj, int start, int target, int* heuristic, int* path, int* path_len);

#endif

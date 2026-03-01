#ifndef BEST_FIRST_SEARCH_H
#define BEST_FIRST_SEARCH_H

#include <vector>

// Returns path from start to target. Empty vector if not found.
// adj is adjacency list: adj[u] contains neighbors of u.
std::vector<int> best_first_search(
    int n, 
    const std::vector<std::vector<int>>& adj, 
    int start, 
    int target, 
    const std::vector<int>& heuristic
);

#endif

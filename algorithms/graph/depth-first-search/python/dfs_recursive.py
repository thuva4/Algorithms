#!/usr/bin/env python3
# Naive recursive implementation of DFS on ordered graphs
from collections import defaultdict
import sys


def dfs(node, adjacency_lists, strategy, visited=None):
    if not visited:
        visited = set()
    
    visited.add(node)
    strategy(node)
    
    for adj_node in adjacency_lists[node]:
        if adj_node in visited:
            continue
        
        dfs(adj_node, adjacency_lists, strategy, visited)


if __name__ == '__main__':
    start_from = next(sys.stdin).strip()
    adjacency = defaultdict(list)

    for line in sys.stdin:
        line = line.strip()
        
        if not line:
            continue

        from_, to = line.split()
        adjacency[from_].append(to)

    dfs(start_from, adjacency, lambda x: print(x))


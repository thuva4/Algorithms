from collections import deque
import sys

# Increase recursion limit just in case
sys.setrecursionlimit(1000000)

def hopcroft_karp(arr):
    if len(arr) < 3:
        return 0
        
    n_left = arr[0]
    n_right = arr[1]
    m = arr[2]
    
    if len(arr) < 3 + 2 * m:
        return 0
    if n_left == 0 or n_right == 0:
        return 0
        
    adj = [[] for _ in range(n_left)]
    for i in range(m):
        u = arr[3 + 2 * i]
        v = arr[3 + 2 * i + 1]
        if 0 <= u < n_left and 0 <= v < n_right:
            adj[u].append(v)
            
    pair_u = [-1] * n_left
    pair_v = [-1] * n_right
    dist = [0] * (n_left + 1)
    INF = float('inf')
    
    def bfs():
        q = deque()
        for u in range(n_left):
            if pair_u[u] == -1:
                dist[u] = 0
                q.append(u)
            else:
                dist[u] = INF
        
        dist[n_left] = INF
        
        while q:
            u = q.popleft()
            
            if dist[u] < dist[n_left]:
                for v in adj[u]:
                    pu = pair_v[v]
                    if pu == -1:
                        if dist[n_left] == INF:
                            dist[n_left] = dist[u] + 1
                    elif dist[pu] == INF:
                        dist[pu] = dist[u] + 1
                        q.append(pu)
                        
        return dist[n_left] != INF
        
    def dfs(u):
        if u != -1:
            for v in adj[u]:
                pu = pair_v[v]
                if pu == -1 or (dist[pu] == dist[u] + 1 and dfs(pu)):
                    pair_v[v] = u
                    pair_u[u] = v
                    return True
            dist[u] = INF
            return False
        return True
        
    matching = 0
    while bfs():
        for u in range(n_left):
            if pair_u[u] == -1:
                if dfs(u):
                    matching += 1
                    
    return matching

import heapq
import sys

def a_star_search(arr):
    if len(arr) < 2:
        return -1
        
    n = arr[0]
    m = arr[1]
    
    if len(arr) < 2 + 3 * m + 2 + n:
        return -1
        
    start = arr[2 + 3 * m]
    goal = arr[2 + 3 * m + 1]
    
    if not (0 <= start < n and 0 <= goal < n):
        return -1
    if start == goal:
        return 0
        
    adj = [[] for _ in range(n)]
    for i in range(m):
        u = arr[2 + 3 * i]
        v = arr[2 + 3 * i + 1]
        w = arr[2 + 3 * i + 2]
        
        if 0 <= u < n and 0 <= v < n:
            adj[u].append((v, w))
            
    h_index = 2 + 3 * m + 2
    h = arr[h_index:h_index + n]
    
    open_set = []
    heapq.heappush(open_set, (h[start], start))
    
    g_score = [float('inf')] * n
    g_score[start] = 0
    
    while open_set:
        f, u = heapq.heappop(open_set)
        
        if u == goal:
            return g_score[goal]
            
        # Optimization: if current g is worse than best known, skip
        # Note: f = g + h, so g = f - h[u]
        g_u = f - h[u]
        if g_u > g_score[u]:
            continue
            
        for v, w in adj[u]:
            if g_score[u] + w < g_score[v]:
                g_score[v] = g_score[u] + w
                f_v = g_score[v] + h[v]
                heapq.heappush(open_set, (f_v, v))
                
    return -1

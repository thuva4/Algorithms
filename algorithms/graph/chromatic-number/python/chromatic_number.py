import sys

# Increase recursion depth
sys.setrecursionlimit(1000000)

def chromatic_number(arr):
    if len(arr) < 2:
        return 0
    n = arr[0]
    m = arr[1]
    
    if len(arr) < 2 + 2 * m:
        return 0
    if n == 0:
        return 0
        
    adj = [[False] * n for _ in range(n)]
    for i in range(m):
        u = arr[2 + 2 * i]
        v = arr[2 + 2 * i + 1]
        if 0 <= u < n and 0 <= v < n:
            adj[u][v] = True
            adj[v][u] = True
            
    color = [0] * n
    
    def is_safe(u, c, k):
        for v in range(n):
            if adj[u][v] and color[v] == c:
                return False
        return True
        
    def graph_coloring_util(u, k):
        if u == n:
            return True
            
        for c in range(1, k + 1):
            if is_safe(u, c, k):
                color[u] = c
                if graph_coloring_util(u + 1, k):
                    return True
                color[u] = 0
        return False
        
    for k in range(1, n + 1):
        if graph_coloring_util(0, k):
            return k
            
    return n

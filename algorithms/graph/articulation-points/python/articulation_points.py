import sys

# Increase recursion depth
sys.setrecursionlimit(1000000)

def articulation_points(arr):
    if len(arr) < 2:
        return 0
    n = arr[0]
    m = arr[1]
    
    if len(arr) < 2 + 2 * m:
        return 0
        
    adj = [[] for _ in range(n)]
    for i in range(m):
        u = arr[2 + 2 * i]
        v = arr[2 + 2 * i + 1]
        if 0 <= u < n and 0 <= v < n:
            adj[u].append(v)
            adj[v].append(u)
            
    dfn = [0] * n
    low = [0] * n
    is_ap = [False] * n
    timer = 0
    
    def dfs(u, p):
        nonlocal timer
        timer += 1
        dfn[u] = low[u] = timer
        children = 0
        
        for v in adj[u]:
            if v == p:
                continue
            if dfn[v]:
                low[u] = min(low[u], dfn[v])
            else:
                children += 1
                dfs(v, u)
                low[u] = min(low[u], low[v])
                if p != -1 and low[v] >= dfn[u]:
                    is_ap[u] = True
                    
        if p == -1 and children > 1:
            is_ap[u] = True
            
    for i in range(n):
        if not dfn[i]:
            dfs(i, -1)
            
    return sum(is_ap)

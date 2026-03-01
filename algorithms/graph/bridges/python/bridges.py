import sys

# Increase recursion depth
sys.setrecursionlimit(1000000)

def count_bridges(arr):
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
    timer = 0
    bridge_cnt = 0
    
    def dfs(u, p):
        nonlocal timer, bridge_cnt
        timer += 1
        dfn[u] = low[u] = timer
        
        for v in adj[u]:
            if v == p:
                continue
            if dfn[v]:
                low[u] = min(low[u], dfn[v])
            else:
                dfs(v, u)
                low[u] = min(low[u], low[v])
                if low[v] > dfn[u]:
                    bridge_cnt += 1
                    
    for i in range(n):
        if not dfn[i]:
            dfs(i, -1)
            
    return bridge_cnt

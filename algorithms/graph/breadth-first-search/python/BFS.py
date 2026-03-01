from collections import deque

def bfs(arr):
    if len(arr) < 2:
        return []
        
    n = arr[0]
    m = arr[1]
    
    if len(arr) < 2 + 2 * m + 1:
        return []
        
    start = arr[2 + 2 * m]
    if start < 0 or start >= n:
        return []
        
    adj = [[] for _ in range(n)]
    for i in range(m):
        u = arr[2 + 2 * i]
        v = arr[2 + 2 * i + 1]
        if 0 <= u < n and 0 <= v < n:
            adj[u].append(v)
            adj[v].append(u)
            
    for i in range(n):
        adj[i].sort()
        
    result = []
    visited = [False] * n
    q = deque([start])
    visited[start] = True
    
    while q:
        u = q.popleft()
        result.append(u)
        
        for v in adj[u]:
            if not visited[v]:
                visited[v] = True
                q.append(v)
                
    return result

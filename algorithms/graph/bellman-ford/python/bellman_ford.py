def bellman_ford(arr):
    if len(arr) < 2:
        return []
        
    n = arr[0]
    m = arr[1]
    
    if len(arr) < 2 + 3 * m + 1:
        return []
        
    start = arr[2 + 3 * m]
    
    if start < 0 or start >= n:
        return []
        
    INF = 1000000000
    dist = [INF] * n
    dist[start] = 0
    
    edges = []
    for i in range(m):
        u = arr[2 + 3 * i]
        v = arr[2 + 3 * i + 1]
        w = arr[2 + 3 * i + 2]
        edges.append((u, v, w))
        
    for _ in range(n - 1):
        for u, v, w in edges:
            if dist[u] != INF and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                
    for u, v, w in edges:
        if dist[u] != INF and dist[u] + w < dist[v]:
            return [] # Negative cycle
            
    return dist

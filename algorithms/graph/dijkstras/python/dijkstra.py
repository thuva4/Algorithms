import heapq

def dijkstra(arr):
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
    
    adj = [[] for _ in range(n)]
    for i in range(m):
        u = arr[2 + 3 * i]
        v = arr[2 + 3 * i + 1]
        w = arr[2 + 3 * i + 2]
        if 0 <= u < n and 0 <= v < n:
            adj[u].append((v, w))
            
    dist = [INF] * n
    dist[start] = 0
    
    pq = [(0, start)]
    
    while pq:
        d, u = heapq.heappop(pq)
        
        if d > dist[u]:
            continue
            
        for v, w in adj[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                heapq.heappush(pq, (dist[v], v))
                
    return dist

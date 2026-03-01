def all_pairs_shortest_path(arr):
    if len(arr) < 2:
        return -1
        
    n = arr[0]
    m = arr[1]
    
    if len(arr) < 2 + 3 * m:
        return -1
    if n <= 0:
        return -1
    if n == 1:
        return 0
        
    INF = 1000000000
    dist = [[INF] * n for _ in range(n)]
    
    for i in range(n):
        dist[i][i] = 0
        
    for i in range(m):
        u = arr[2 + 3 * i]
        v = arr[2 + 3 * i + 1]
        w = arr[2 + 3 * i + 2]
        
        if 0 <= u < n and 0 <= v < n:
            dist[u][v] = min(dist[u][v], w)
            
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if dist[i][k] != INF and dist[k][j] != INF:
                    dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])
                    
    return -1 if dist[0][n-1] == INF else dist[0][n-1]

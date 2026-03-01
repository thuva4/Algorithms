def counting_triangles(arr):
    if len(arr) < 2:
        return 0
    n = arr[0]
    m = arr[1]
    
    if len(arr) < 2 + 2 * m:
        return 0
    if n < 3:
        return 0
        
    adj = [[False] * n for _ in range(n)]
    for i in range(m):
        u = arr[2 + 2 * i]
        v = arr[2 + 2 * i + 1]
        if 0 <= u < n and 0 <= v < n:
            adj[u][v] = True
            adj[v][u] = True
            
    count = 0
    for i in range(n):
        for j in range(i + 1, n):
            if adj[i][j]:
                for k in range(j + 1, n):
                    if adj[j][k] and adj[k][i]:
                        count += 1
                        
    return count

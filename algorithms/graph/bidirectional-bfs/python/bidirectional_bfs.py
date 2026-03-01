from collections import deque

def bidirectional_bfs(arr):
    if len(arr) < 4:
        return -1
        
    n = arr[0]
    m = arr[1]
    start = arr[2]
    end = arr[3]
    
    if len(arr) < 4 + 2 * m:
        return -1
    if start == end:
        return 0
        
    adj = [[] for _ in range(n)]
    for i in range(m):
        u = arr[4 + 2 * i]
        v = arr[4 + 2 * i + 1]
        if 0 <= u < n and 0 <= v < n:
            adj[u].append(v)
            adj[v].append(u)
            
    dist_start = [-1] * n
    dist_end = [-1] * n
    
    q_start = deque([start])
    dist_start[start] = 0
    
    q_end = deque([end])
    dist_end[end] = 0
    
    while q_start and q_end:
        # Expand start
        u = q_start.popleft()
        if dist_end[u] != -1:
            return dist_start[u] + dist_end[u]
            
        for v in adj[u]:
            if dist_start[v] == -1:
                dist_start[v] = dist_start[u] + 1
                if dist_end[v] != -1:
                    return dist_start[v] + dist_end[v]
                q_start.append(v)
                
        # Expand end
        u = q_end.popleft()
        if dist_start[u] != -1:
            return dist_start[u] + dist_end[u]
            
        for v in adj[u]:
            if dist_end[v] == -1:
                dist_end[v] = dist_end[u] + 1
                if dist_start[v] != -1:
                    return dist_start[v] + dist_end[v]
                q_end.append(v)
                
    return -1

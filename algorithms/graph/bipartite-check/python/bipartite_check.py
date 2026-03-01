from collections import deque

def is_bipartite(arr):
    if len(arr) < 2:
        return 0
        
    n = arr[0]
    m = arr[1]
    
    if len(arr) < 2 + 2 * m:
        return 0
    if n == 0:
        return 1
        
    adj = [[] for _ in range(n)]
    for i in range(m):
        u = arr[2 + 2 * i]
        v = arr[2 + 2 * i + 1]
        if 0 <= u < n and 0 <= v < n:
            adj[u].append(v)
            adj[v].append(u)
            
    color = [0] * n # 0: none, 1: red, -1: blue
    q = deque()
    
    for i in range(n):
        if color[i] == 0:
            color[i] = 1
            q.append(i)
            
            while q:
                u = q.popleft()
                
                for v in adj[u]:
                    if color[v] == 0:
                        color[v] = -color[u]
                        q.append(v)
                    elif color[v] == color[u]:
                        return 0
                        
    return 1

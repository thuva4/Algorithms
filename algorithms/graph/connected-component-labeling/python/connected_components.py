from collections import deque

def connected_components(arr):
    if len(arr) < 2:
        return []
        
    n = arr[0]
    m = arr[1]
    
    if len(arr) < 2 + 2 * m:
        return []
    if n == 0:
        return []
        
    adj = [[] for _ in range(n)]
    for i in range(m):
        u = arr[2 + 2 * i]
        v = arr[2 + 2 * i + 1]
        if 0 <= u < n and 0 <= v < n:
            adj[u].append(v)
            adj[v].append(u)
            
    labels = [-1] * n
    q = deque()
    
    for i in range(n):
        if labels[i] == -1:
            component_id = i
            labels[i] = component_id
            q.append(i)
            
            while q:
                u = q.popleft()
                
                for v in adj[u]:
                    if labels[v] == -1:
                        labels[v] = component_id
                        q.append(v)
                        
    return labels

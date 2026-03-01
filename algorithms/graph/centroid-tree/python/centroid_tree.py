import sys

# Increase recursion depth
sys.setrecursionlimit(1000000)

def centroid_tree(arr):
    if len(arr) < 1:
        return 0
    n = arr[0]
    
    if n <= 1:
        return 0
    if len(arr) < 1 + 2 * (n - 1):
        return 0
        
    adj = [[] for _ in range(n)]
    for i in range(n - 1):
        u = arr[1 + 2 * i]
        v = arr[1 + 2 * i + 1]
        if 0 <= u < n and 0 <= v < n:
            adj[u].append(v)
            adj[v].append(u)
            
    sz = [0] * n
    removed = [False] * n
    max_depth = 0
    
    def get_size(u, p):
        sz[u] = 1
        for v in adj[u]:
            if v != p and not removed[v]:
                get_size(v, u)
                sz[u] += sz[v]
                
    def get_centroid(u, p, total):
        for v in adj[u]:
            if v != p and not removed[v] and sz[v] > total // 2:
                return get_centroid(v, u, total)
        return u
        
    def decompose(u, depth):
        nonlocal max_depth
        get_size(u, -1)
        total = sz[u]
        centroid = get_centroid(u, -1, total)
        
        max_depth = max(max_depth, depth)
        
        removed[centroid] = True
        
        for v in adj[centroid]:
            if not removed[v]:
                decompose(v, depth + 1)
                
    decompose(0, 0)
    
    return max_depth

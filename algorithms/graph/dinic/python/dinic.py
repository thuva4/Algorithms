from collections import deque
import sys

# Increase recursion limit
sys.setrecursionlimit(1000000)

class Edge:
    def __init__(self, to, rev, cap, flow=0):
        self.to = to
        self.rev = rev
        self.cap = cap
        self.flow = flow

def dinic(arr):
    if len(arr) < 4:
        return 0
    n = arr[0]
    m = arr[1]
    s = arr[2]
    t = arr[3]
    
    if len(arr) < 4 + 3 * m:
        return 0
        
    adj = [[] for _ in range(n)]
    
    def add_edge(u, v, cap):
        a = Edge(v, len(adj[v]), cap)
        b = Edge(u, len(adj[u]), 0)
        adj[u].append(a)
        adj[v].append(b)
        
    for i in range(m):
        u = arr[4 + 3 * i]
        v = arr[4 + 3 * i + 1]
        cap = arr[4 + 3 * i + 2]
        if 0 <= u < n and 0 <= v < n:
            add_edge(u, v, cap)
            
    level = [-1] * n
    ptr = [0] * n
    
    def bfs():
        for i in range(n):
            level[i] = -1
        level[s] = 0
        q = deque([s])
        while q:
            u = q.popleft()
            for e in adj[u]:
                if e.cap - e.flow > 0 and level[e.to] == -1:
                    level[e.to] = level[u] + 1
                    q.append(e.to)
        return level[t] != -1
        
    def dfs(u, pushed):
        if pushed == 0:
            return 0
        if u == t:
            return pushed
            
        for cid in range(ptr[u], len(adj[u])):
            ptr[u] = cid
            e = adj[u][cid]
            v = e.to
            if level[u] + 1 != level[v] or e.cap - e.flow == 0:
                continue
                
            tr = pushed
            if e.cap - e.flow < tr:
                tr = e.cap - e.flow
                
            pushed_flow = dfs(v, tr)
            if pushed_flow == 0:
                continue
                
            e.flow += pushed_flow
            adj[v][e.rev].flow -= pushed_flow
            return pushed_flow
            
        ptr[u] = len(adj[u]) # Fully explored
        return 0
        
    flow = 0
    while bfs():
        for i in range(n):
            ptr[i] = 0
        while True:
            pushed = dfs(s, float('inf'))
            if pushed == 0:
                break
            flow += pushed
            
    return flow

import sys

# Increase recursion depth for deep graphs
sys.setrecursionlimit(1000000)

def two_sat(arr):
    if len(arr) < 2:
        return 0
    n = arr[0]
    m = arr[1]
    
    if len(arr) < 2 + 2 * m:
        return 0
        
    num_nodes = 2 * n
    adj = [[] for _ in range(num_nodes)]
    
    for i in range(m):
        u_raw = arr[2 + 2 * i]
        v_raw = arr[2 + 2 * i + 1]
        
        u = (abs(u_raw) - 1) * 2 + (1 if u_raw < 0 else 0)
        v = (abs(v_raw) - 1) * 2 + (1 if v_raw < 0 else 0)
        
        not_u = u ^ 1
        not_v = v ^ 1
        
        adj[not_u].append(v)
        adj[not_v].append(u)
        
    dfn = [0] * num_nodes
    low = [0] * num_nodes
    scc_id = [0] * num_nodes
    in_stack = [False] * num_nodes
    stack = []
    timer = 0
    scc_cnt = 0
    
    def tarjan(u):
        nonlocal timer, scc_cnt
        timer += 1
        dfn[u] = low[u] = timer
        stack.append(u)
        in_stack[u] = True
        
        for v in adj[u]:
            if dfn[v] == 0:
                tarjan(v)
                low[u] = min(low[u], low[v])
            elif in_stack[v]:
                low[u] = min(low[u], dfn[v])
                
        if low[u] == dfn[u]:
            scc_cnt += 1
            while True:
                v = stack.pop()
                in_stack[v] = False
                scc_id[v] = scc_cnt
                if u == v:
                    break

    for i in range(num_nodes):
        if dfn[i] == 0:
            tarjan(i)
            
    for i in range(n):
        if scc_id[2 * i] == scc_id[2 * i + 1]:
            return 0
            
    return 1

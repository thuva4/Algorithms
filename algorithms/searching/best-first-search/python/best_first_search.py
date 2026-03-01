import heapq

def best_first_search(n, adj, start, target, heuristic):
    """
    n: number of nodes
    adj: adjacency list (list of lists)
    start: start node index
    target: target node index
    heuristic: list of heuristic values
    """
    pq = []
    # Push tuple (priority, node_id)
    heapq.heappush(pq, (heuristic[start], start))
    
    visited = [False] * n
    parent = [-1] * n
    
    visited[start] = True
    found = False
    
    while pq:
        _, u = heapq.heappop(pq)
        
        if u == target:
            found = True
            break
            
        for v in adj[u]:
            if not visited[v]:
                visited[v] = True
                parent[v] = u
                heapq.heappush(pq, (heuristic[v], v))
                
    path = []
    if found:
        curr = target
        while curr != -1:
            path.append(curr)
            curr = parent[curr]
        path.reverse()
        
    return path

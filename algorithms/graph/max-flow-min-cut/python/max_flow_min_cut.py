from collections import deque

def max_flow_min_cut(arr: list[int]) -> int:
    n = arr[0]
    m = arr[1]
    src = arr[2]
    sink = arr[3]
    cap = [[0] * n for _ in range(n)]
    for i in range(m):
        u = arr[4 + 3 * i]
        v = arr[5 + 3 * i]
        c = arr[6 + 3 * i]
        cap[u][v] += c

    def bfs(parent):
        visited = [False] * n
        visited[src] = True
        queue = deque([src])
        while queue:
            u = queue.popleft()
            for v in range(n):
                if not visited[v] and cap[u][v] > 0:
                    visited[v] = True
                    parent[v] = u
                    if v == sink:
                        return True
                    queue.append(v)
        return False

    max_flow = 0
    parent = [-1] * n
    while bfs(parent):
        path_flow = float('inf')
        v = sink
        while v != src:
            u = parent[v]
            path_flow = min(path_flow, cap[u][v])
            v = u
        v = sink
        while v != src:
            u = parent[v]
            cap[u][v] -= path_flow
            cap[v][u] += path_flow
            v = u
        max_flow += path_flow
        parent = [-1] * n

    return max_flow

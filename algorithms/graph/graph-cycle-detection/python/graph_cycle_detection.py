def graph_cycle_detection(arr: list[int]) -> int:
    n = arr[0]
    m = arr[1]
    adj = [[] for _ in range(n)]
    for i in range(m):
        u = arr[2 + 2 * i]
        v = arr[2 + 2 * i + 1]
        adj[u].append(v)

    WHITE, GRAY, BLACK = 0, 1, 2
    color = [WHITE] * n

    def dfs(v):
        color[v] = GRAY
        for w in adj[v]:
            if color[w] == GRAY:
                return True
            if color[w] == WHITE and dfs(w):
                return True
        color[v] = BLACK
        return False

    for v in range(n):
        if color[v] == WHITE:
            if dfs(v):
                return 1
    return 0

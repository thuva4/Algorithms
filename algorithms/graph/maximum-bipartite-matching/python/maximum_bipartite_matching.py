def maximum_bipartite_matching(arr: list[int]) -> int:
    n_left = arr[0]
    n_right = arr[1]
    m = arr[2]
    adj = [[] for _ in range(n_left)]
    for i in range(m):
        u = arr[3 + 2 * i]
        v = arr[3 + 2 * i + 1]
        adj[u].append(v)

    match_right = [-1] * n_right

    def dfs(u, visited):
        for v in adj[u]:
            if not visited[v]:
                visited[v] = True
                if match_right[v] == -1 or dfs(match_right[v], visited):
                    match_right[v] = u
                    return True
        return False

    result = 0
    for u in range(n_left):
        visited = [False] * n_right
        if dfs(u, visited):
            result += 1
    return result

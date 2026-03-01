def euler_path(arr: list[int]) -> int:
    n = arr[0]
    m = arr[1]
    if n == 0:
        return 1
    adj = [[] for _ in range(n)]
    degree = [0] * n
    for i in range(m):
        u, v = arr[2 + 2 * i], arr[3 + 2 * i]
        adj[u].append(v)
        adj[v].append(u)
        degree[u] += 1
        degree[v] += 1

    # Check all degrees are even
    for d in degree:
        if d % 2 != 0:
            return 0

    # Check connectivity of non-zero degree vertices
    start = -1
    for i in range(n):
        if degree[i] > 0:
            start = i
            break
    if start == -1:
        return 1  # no edges

    visited = [False] * n
    stack = [start]
    visited[start] = True
    while stack:
        v = stack.pop()
        for u in adj[v]:
            if not visited[u]:
                visited[u] = True
                stack.append(u)

    for i in range(n):
        if degree[i] > 0 and not visited[i]:
            return 0

    return 1

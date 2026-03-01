def chromatic_number(arr: list[int]) -> int:
    n = arr[0]
    m = arr[1]
    if n == 0:
        return 0
    if m == 0:
        return 1

    adj = [[] for _ in range(n)]
    for i in range(m):
        u = arr[2 + 2 * i]
        v = arr[2 + 2 * i + 1]
        adj[u].append(v)
        adj[v].append(u)

    def can_color(k):
        colors = [0] * n

        def is_safe(v, c):
            for u in adj[v]:
                if colors[u] == c:
                    return False
            return True

        def solve(v):
            if v == n:
                return True
            for c in range(1, k + 1):
                if is_safe(v, c):
                    colors[v] = c
                    if solve(v + 1):
                        return True
                    colors[v] = 0
            return False

        return solve(0)

    for k in range(1, n + 1):
        if can_color(k):
            return k

    return n

import sys
from collections import defaultdict

def dp_on_trees(n, values, edges):
    """Find maximum downward path sum in a tree."""
    if n == 0:
        return 0
    if n == 1:
        return values[0]

    adj = defaultdict(list)
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)

    dp = [0] * n
    visited = [False] * n
    ans = float('-inf')

    # Iterative DFS with post-order processing
    stack = [(0, False)]
    visited[0] = True
    parent = [-1] * n

    order = []
    while stack:
        node, processed = stack.pop()
        if processed:
            best_child = 0
            for child in adj[node]:
                if child != parent[node]:
                    best_child = max(best_child, dp[child])
            dp[node] = values[node] + best_child
            continue

        stack.append((node, True))
        for child in adj[node]:
            if not visited[child]:
                visited[child] = True
                parent[child] = node
                stack.append((child, False))

    return max(dp)


if __name__ == "__main__":
    data = sys.stdin.read().split()
    idx = 0
    n = int(data[idx]); idx += 1
    values = [int(data[idx + i]) for i in range(n)]; idx += n
    edges = []
    for i in range(n - 1):
        u = int(data[idx]); idx += 1
        v = int(data[idx]); idx += 1
        edges.append((u, v))
    print(dp_on_trees(n, values, edges))

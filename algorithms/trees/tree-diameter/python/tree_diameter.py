from collections import deque


def tree_diameter(arr):
    """
    Find the diameter of an unweighted tree using two BFS passes.

    Input format: [n, u1, v1, u2, v2, ...]
    Returns: diameter (number of edges in the longest path)
    """
    idx = 0
    n = arr[idx]; idx += 1

    if n <= 1:
        return 0

    adj = [[] for _ in range(n)]
    m = (len(arr) - 1) // 2
    for _ in range(m):
        u = arr[idx]; idx += 1
        v = arr[idx]; idx += 1
        adj[u].append(v)
        adj[v].append(u)

    def bfs(start):
        dist = [-1] * n
        dist[start] = 0
        queue = deque([start])
        farthest = start
        while queue:
            node = queue.popleft()
            for neighbor in adj[node]:
                if dist[neighbor] == -1:
                    dist[neighbor] = dist[node] + 1
                    queue.append(neighbor)
                    if dist[neighbor] > dist[farthest]:
                        farthest = neighbor
        return farthest, dist[farthest]

    u, _ = bfs(0)
    _, diameter = bfs(u)
    return diameter


if __name__ == "__main__":
    print(tree_diameter([4, 0, 1, 1, 2, 2, 3]))  # 3
    print(tree_diameter([5, 0, 1, 0, 2, 0, 3, 0, 4]))  # 2
    print(tree_diameter([2, 0, 1]))  # 1
    print(tree_diameter([1]))  # 0

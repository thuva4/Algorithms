import heapq

def prims_fibonacci_heap(arr: list[int]) -> int:
    n = arr[0]
    m = arr[1]
    adj = [[] for _ in range(n)]
    for i in range(m):
        u = arr[2 + 3 * i]
        v = arr[2 + 3 * i + 1]
        w = arr[2 + 3 * i + 2]
        adj[u].append((w, v))
        adj[v].append((w, u))

    in_mst = [False] * n
    key = [float('inf')] * n
    key[0] = 0
    heap = [(0, 0)]
    total = 0

    while heap:
        w, u = heapq.heappop(heap)
        if in_mst[u]:
            continue
        in_mst[u] = True
        total += w
        for weight, v in adj[u]:
            if not in_mst[v] and weight < key[v]:
                key[v] = weight
                heapq.heappush(heap, (weight, v))

    return total

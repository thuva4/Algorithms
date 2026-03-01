def strongly_connected_condensation(arr: list[int]) -> int:
    n = arr[0]
    m = arr[1]
    adj = [[] for _ in range(n)]
    for i in range(m):
        u = arr[2 + 2 * i]
        v = arr[2 + 2 * i + 1]
        adj[u].append(v)

    index_counter = [0]
    scc_count = [0]
    disc = [-1] * n
    low = [0] * n
    on_stack = [False] * n
    stack = []

    def strongconnect(v):
        disc[v] = index_counter[0]
        low[v] = index_counter[0]
        index_counter[0] += 1
        stack.append(v)
        on_stack[v] = True

        for w in adj[v]:
            if disc[w] == -1:
                strongconnect(w)
                low[v] = min(low[v], low[w])
            elif on_stack[w]:
                low[v] = min(low[v], disc[w])

        if low[v] == disc[v]:
            scc_count[0] += 1
            while True:
                w = stack.pop()
                on_stack[w] = False
                if w == v:
                    break

    for v in range(n):
        if disc[v] == -1:
            strongconnect(v)

    return scc_count[0]

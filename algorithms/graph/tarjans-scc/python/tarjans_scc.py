def tarjans_scc(arr: list[int]) -> int:
    n = arr[0]
    m = arr[1]
    adj = [[] for _ in range(n)]
    for i in range(m):
        u = arr[2 + 2 * i]
        v = arr[2 + 2 * i + 1]
        adj[u].append(v)

    index_counter = [0]
    stack = []
    on_stack = [False] * n
    index = [-1] * n
    lowlink = [0] * n
    scc_count = [0]

    def strongconnect(v):
        index[v] = index_counter[0]
        lowlink[v] = index_counter[0]
        index_counter[0] += 1
        stack.append(v)
        on_stack[v] = True

        for w in adj[v]:
            if index[w] == -1:
                strongconnect(w)
                lowlink[v] = min(lowlink[v], lowlink[w])
            elif on_stack[w]:
                lowlink[v] = min(lowlink[v], index[w])

        if lowlink[v] == index[v]:
            scc_count[0] += 1
            while True:
                w = stack.pop()
                on_stack[w] = False
                if w == v:
                    break

    for v in range(n):
        if index[v] == -1:
            strongconnect(v)

    return scc_count[0]

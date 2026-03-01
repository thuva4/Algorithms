def minimum_spanning_arborescence(arr: list[int]) -> int:
    n = arr[0]
    m = arr[1]
    root = arr[2]
    edges = []
    for i in range(m):
        u = arr[3 + 3 * i]
        v = arr[3 + 3 * i + 1]
        w = arr[3 + 3 * i + 2]
        edges.append((u, v, w))

    INF = float('inf')
    res = 0
    node_id = list(range(n))

    while True:
        # Find min incoming edge for each node
        min_in = [INF] * n
        min_edge = [-1] * n
        for i, (u, v, w) in enumerate(edges):
            if u != v and v != root and w < min_in[v]:
                min_in[v] = w
                min_edge[v] = u

        # Check if all nodes reachable
        for i in range(n):
            if i != root and min_in[i] == INF:
                return -1  # not reachable

        # Add min edges cost
        comp = [-1] * n
        comp[root] = root
        num_cycles = 0
        cycle_id = [-1] * n

        for i in range(n):
            if i == root:
                continue
            res += min_in[i]

        # Detect cycles
        visited = [-1] * n
        for i in range(n):
            if i == root:
                continue
            v = i
            while visited[v] == -1 and comp[v] == -1 and v != root:
                visited[v] = i
                v = min_edge[v]

            if v != root and comp[v] == -1 and visited[v] == i:
                # Found a cycle
                cid = num_cycles
                u = v
                while True:
                    cycle_id[u] = cid
                    comp[u] = cid
                    u = min_edge[u]
                    if u == v:
                        break
                num_cycles += 1

        if num_cycles == 0:
            break

        # Assign non-cycle nodes
        for i in range(n):
            if comp[i] == -1:
                comp[i] = num_cycles
                num_cycles += 1

        # Contract graph
        new_edges = []
        for u, v, w in edges:
            nu = comp[u]
            nv = comp[v]
            if nu != nv:
                new_edges.append((nu, nv, w - min_in[v]))

        edges = new_edges
        root = comp[root]
        n = num_cycles

    return res

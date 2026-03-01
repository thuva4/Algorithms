def strongly_connected_path_based(arr: list[int]) -> int:
    n = arr[0]
    m = arr[1]
    adj = [[] for _ in range(n)]
    for i in range(m):
        u = arr[2 + 2 * i]
        v = arr[2 + 2 * i + 1]
        adj[u].append(v)

    preorder = [-1] * n
    counter = [0]
    s_stack = []
    p_stack = []
    assigned = [False] * n
    scc_count = [0]

    def dfs(v):
        preorder[v] = counter[0]
        counter[0] += 1
        s_stack.append(v)
        p_stack.append(v)

        for w in adj[v]:
            if preorder[w] == -1:
                dfs(w)
            elif not assigned[w]:
                while preorder[p_stack[-1]] > preorder[w]:
                    p_stack.pop()

        if p_stack and p_stack[-1] == v:
            p_stack.pop()
            scc_count[0] += 1
            while True:
                u = s_stack.pop()
                assigned[u] = True
                if u == v:
                    break

    for v in range(n):
        if preorder[v] == -1:
            dfs(v)

    return scc_count[0]

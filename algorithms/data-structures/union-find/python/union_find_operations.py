def union_find_operations(n: int, operations: list[dict]) -> list[bool]:
    parent = list(range(n))
    rank = [0] * n

    def find(node: int) -> int:
        while parent[node] != node:
            parent[node] = parent[parent[node]]
            node = parent[node]
        return node

    def union(a: int, b: int) -> None:
        root_a = find(a)
        root_b = find(b)
        if root_a == root_b:
            return
        if rank[root_a] < rank[root_b]:
            root_a, root_b = root_b, root_a
        parent[root_b] = root_a
        if rank[root_a] == rank[root_b]:
            rank[root_a] += 1

    results: list[bool] = []
    for operation in operations:
        a = int(operation["a"])
        b = int(operation["b"])
        if operation["type"] == "union":
            union(a, b)
        else:
            results.append(find(a) == find(b))
    return results

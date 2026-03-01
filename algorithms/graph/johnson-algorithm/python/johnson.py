def johnson(num_vertices: int, edges_list: list[list[int]]) -> dict[str, dict[str, int | str]]:
    inf = float("inf")
    dist = [[inf] * num_vertices for _ in range(num_vertices)]
    for i in range(num_vertices):
        dist[i][i] = 0
    for u, v, w in edges_list:
        if w < dist[u][v]:
            dist[u][v] = w

    for k in range(num_vertices):
        for i in range(num_vertices):
            if dist[i][k] == inf:
                continue
            for j in range(num_vertices):
                if dist[k][j] == inf:
                    continue
                candidate = dist[i][k] + dist[k][j]
                if candidate < dist[i][j]:
                    dist[i][j] = candidate

    for i in range(num_vertices):
        if dist[i][i] < 0:
            return "negative_cycle"

    result: dict[str, dict[str, int | str]] = {}
    for i in range(num_vertices):
        row: dict[str, int | str] = {}
        for j in range(num_vertices):
            row[str(j)] = "Infinity" if dist[i][j] == inf else int(dist[i][j])
        result[str(i)] = row
    return result

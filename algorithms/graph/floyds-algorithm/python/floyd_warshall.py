def floyd_warshall(distance_matrix: list[list[int | str]]) -> list[list[int]]:
    inf = float("inf")
    dist = [
        [inf if value == "Infinity" else int(value) for value in row]
        for row in distance_matrix
    ]
    n = len(dist)
    for k in range(n):
        for i in range(n):
            if dist[i][k] == inf:
                continue
            for j in range(n):
                if dist[k][j] == inf:
                    continue
                candidate = dist[i][k] + dist[k][j]
                if candidate < dist[i][j]:
                    dist[i][j] = candidate
    result: list[list[int | str]] = []
    for i, row in enumerate(dist):
        converted_row: list[int | str] = []
        for j, value in enumerate(row):
            if value == inf:
                converted_row.append(0 if i == j else "Infinity")
            else:
                converted_row.append(int(value))
        result.append(converted_row)
    return result

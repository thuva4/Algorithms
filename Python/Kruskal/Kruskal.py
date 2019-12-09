parent = {}
rank = {}

#concatenate the set
def make_set(v):
    parent[v] = v
    rank[v] = 0

#find the End parent
def find(v):
    if parent[v] != v:
        parent[v] = find(parent[v])

    return parent[v]

#Union the set
def union(v, u):
    nodeA = find(v)
    nodeB = find(u)

    if nodeA != nodeB:
        if rank[nodeA] > rank[nodeB]:
            parent[nodeB] = nodeA
        else:
            parent[nodeA] = nodeB

            if rank[nodeA] == rank[nodeB]:
                rank[nodeB] += 1

def kruskal(graph):
    for v in graph['V']:
        make_set(v)

    ShortestPath = []

    edges = graph['E']
    edges.sort()

    for edge in edges:
        weight, v, u = edge

        if find(v) != find(u):
            union(v, u)
            ShortestPath.append(edge)

    return ShortestPath


graph = {
    'V': ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'],
    'E': [
        (4, 'a', 'b'),
        (8, 'a', 'h'),
        (8, 'b', 'c'),
        (11, 'b', 'h'),
        (7, 'c', 'd'),
        (2, 'c', 'i'),
        (4, 'c', 'f'),
        (9, 'd', 'e'),
        (14, 'd', 'f'),
        (10, 'e', 'f'),
        (2, 'f', 'g'),
        (6, 'g', 'i'),
        (1, 'g', 'h'),
    ]
}

print(kruskal(graph))

#!usr/bin/env python3


def Topological_Sort(vertices, edges):
    def recursive_add(node):
        if (node in ans):
            return

        if (edges[node] != []):
            for edged_node in edges[node]:
                recursive_add(edged_node)
        ans.append(node)
        # Memoizing this node, as all children have been covered
        edges[node] = []

    ans = []
    while len(vertices) > 0:
        node = vertices.pop()
        recursive_add(node)

    return ans[::-1]


def run():
    # Keep in mind that there are mutiple possbile solutions for this given example
    vertices = [5, 7, 3, 11, 2, 8, 9, 10]
    edges = {
        5: [11],
        7: [11, 8],
        3: [8, 10],
        11: [2, 9, 10],
        8: [9],
        2: [],
        9: [],
        10: [],
    }

    print(Topological_Sort(vertices, edges))

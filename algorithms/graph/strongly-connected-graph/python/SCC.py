"""
Kosaraju's algorithm to find strongly connected components (SCCs).
"""


def find_sccs(adj_list):
    """
    Find all strongly connected components using Kosaraju's algorithm.

    Args:
        adj_list: Adjacency list as a dict mapping node to list of neighbors

    Returns:
        List of lists, where each inner list is an SCC
    """
    num_nodes = len(adj_list)
    visited = set()
    finish_order = []

    # First DFS pass
    def dfs1(node):
        visited.add(node)
        for neighbor in adj_list.get(node, []):
            if neighbor not in visited:
                dfs1(neighbor)
        finish_order.append(node)

    for i in range(num_nodes):
        if i not in visited:
            dfs1(i)

    # Build reverse graph
    rev_adj = {node: [] for node in adj_list}
    for node, neighbors in adj_list.items():
        for neighbor in neighbors:
            rev_adj.setdefault(neighbor, []).append(node)

    # Second DFS pass on reversed graph
    visited.clear()
    components = []

    def dfs2(node, component):
        visited.add(node)
        component.append(node)
        for neighbor in rev_adj.get(node, []):
            if neighbor not in visited:
                dfs2(neighbor, component)

    for node in reversed(finish_order):
        if node not in visited:
            component = []
            dfs2(node, component)
            components.append(component)

    return components


if __name__ == "__main__":
    adj_list = {
        0: [1],
        1: [2],
        2: [0, 3],
        3: [4],
        4: [3],
    }
    components = find_sccs(adj_list)
    print(f"SCCs: {components}")

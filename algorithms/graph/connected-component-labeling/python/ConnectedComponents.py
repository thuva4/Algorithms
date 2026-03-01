"""
Find all connected components in an undirected graph using DFS.
"""


def connected_components(adj_list):
    """
    Find all connected components.

    Args:
        adj_list: Adjacency list as a dict mapping node to list of neighbors

    Returns:
        List of lists, where each inner list is a connected component
    """
    visited = set()
    components = []

    def dfs(node, component):
        visited.add(node)
        component.append(node)
        for neighbor in adj_list.get(node, []):
            if neighbor not in visited:
                dfs(neighbor, component)

    num_nodes = len(adj_list)
    for i in range(num_nodes):
        if i not in visited:
            component = []
            dfs(i, component)
            components.append(component)

    return components


if __name__ == "__main__":
    adj_list = {
        0: [1],
        1: [0],
        2: [3],
        3: [2],
    }
    result = connected_components(adj_list)
    print(f"Connected components: {result}")

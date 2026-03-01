def b_tree(arr: list[int]) -> list[int]:
    T = 3  # minimum degree

    class Node:
        def __init__(self, leaf=True):
            self.keys = []
            self.children = []
            self.leaf = leaf

    root = None

    def split_child(parent, i):
        full = parent.children[i]
        new_node = Node(leaf=full.leaf)
        mid = T - 1
        parent.keys.insert(i, full.keys[mid])
        new_node.keys = full.keys[mid + 1:]
        full.keys = full.keys[:mid]
        if not full.leaf:
            new_node.children = full.children[T:]
            full.children = full.children[:T]
        parent.children.insert(i + 1, new_node)

    def insert_non_full(node, key):
        i = len(node.keys) - 1
        if node.leaf:
            node.keys.append(0)
            while i >= 0 and key < node.keys[i]:
                node.keys[i + 1] = node.keys[i]
                i -= 1
            node.keys[i + 1] = key
        else:
            while i >= 0 and key < node.keys[i]:
                i -= 1
            i += 1
            if len(node.children[i].keys) == 2 * T - 1:
                split_child(node, i)
                if key > node.keys[i]:
                    i += 1
            insert_non_full(node.children[i], key)

    def insert(key):
        nonlocal root
        if root is None:
            root = Node(leaf=True)
            root.keys.append(key)
            return
        if len(root.keys) == 2 * T - 1:
            new_root = Node(leaf=False)
            new_root.children.append(root)
            split_child(new_root, 0)
            root = new_root
        insert_non_full(root, key)

    def inorder(node):
        if node is None:
            return []
        result = []
        for i in range(len(node.keys)):
            if not node.leaf:
                result.extend(inorder(node.children[i]))
            result.append(node.keys[i])
        if not node.leaf:
            result.extend(inorder(node.children[len(node.keys)]))
        return result

    for val in arr:
        insert(val)

    return inorder(root)

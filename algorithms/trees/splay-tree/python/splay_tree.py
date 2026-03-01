def splay_tree(arr: list[int]) -> list[int]:
    class Node:
        def __init__(self, key):
            self.key = key
            self.left = None
            self.right = None

    def right_rotate(x):
        y = x.left
        x.left = y.right
        y.right = x
        return y

    def left_rotate(x):
        y = x.right
        x.right = y.left
        y.left = x
        return y

    def splay(root, key):
        if root is None or root.key == key:
            return root
        if key < root.key:
            if root.left is None:
                return root
            if key < root.left.key:
                root.left.left = splay(root.left.left, key)
                root = right_rotate(root)
            elif key > root.left.key:
                root.left.right = splay(root.left.right, key)
                if root.left.right:
                    root.left = left_rotate(root.left)
            return root if root.left is None else right_rotate(root)
        else:
            if root.right is None:
                return root
            if key > root.right.key:
                root.right.right = splay(root.right.right, key)
                root = left_rotate(root)
            elif key < root.right.key:
                root.right.left = splay(root.right.left, key)
                if root.right.left:
                    root.right = right_rotate(root.right)
            return root if root.right is None else left_rotate(root)

    def insert(root, key):
        if root is None:
            return Node(key)
        root = splay(root, key)
        if root.key == key:
            return root
        new_node = Node(key)
        if key < root.key:
            new_node.right = root
            new_node.left = root.left
            root.left = None
        else:
            new_node.left = root
            new_node.right = root.right
            root.right = None
        return new_node

    def inorder(node, result):
        if node is None:
            return
        inorder(node.left, result)
        result.append(node.key)
        inorder(node.right, result)

    root = None
    for val in arr:
        root = insert(root, val)

    result = []
    inorder(root, result)
    return result

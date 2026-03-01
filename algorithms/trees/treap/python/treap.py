import random

def treap(arr: list[int]) -> list[int]:
    class Node:
        def __init__(self, key):
            self.key = key
            self.priority = random.randint(0, 1 << 30)
            self.left = None
            self.right = None

    def right_rotate(p):
        q = p.left
        p.left = q.right
        q.right = p
        return q

    def left_rotate(p):
        q = p.right
        p.right = q.left
        q.left = p
        return q

    def insert(root, key):
        if root is None:
            return Node(key)
        if key < root.key:
            root.left = insert(root.left, key)
            if root.left.priority > root.priority:
                root = right_rotate(root)
        elif key > root.key:
            root.right = insert(root.right, key)
            if root.right.priority > root.priority:
                root = left_rotate(root)
        return root

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

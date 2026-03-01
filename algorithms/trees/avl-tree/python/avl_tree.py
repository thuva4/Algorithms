def avl_insert_inorder(arr: list[int]) -> list[int]:
    class Node:
        def __init__(self, key: int):
            self.key = key
            self.left: 'Node | None' = None
            self.right: 'Node | None' = None
            self.height: int = 1

    def height(node: 'Node | None') -> int:
        return node.height if node else 0

    def balance_factor(node: 'Node | None') -> int:
        return height(node.left) - height(node.right) if node else 0

    def update_height(node: Node) -> None:
        node.height = 1 + max(height(node.left), height(node.right))

    def rotate_right(y: Node) -> Node:
        x = y.left
        t2 = x.right
        x.right = y
        y.left = t2
        update_height(y)
        update_height(x)
        return x

    def rotate_left(x: Node) -> Node:
        y = x.right
        t2 = y.left
        y.left = x
        x.right = t2
        update_height(x)
        update_height(y)
        return y

    def insert(node: 'Node | None', key: int) -> Node:
        if not node:
            return Node(key)
        if key < node.key:
            node.left = insert(node.left, key)
        elif key > node.key:
            node.right = insert(node.right, key)
        else:
            return node

        update_height(node)
        bf = balance_factor(node)

        if bf > 1 and key < node.left.key:
            return rotate_right(node)
        if bf < -1 and key > node.right.key:
            return rotate_left(node)
        if bf > 1 and key > node.left.key:
            node.left = rotate_left(node.left)
            return rotate_right(node)
        if bf < -1 and key < node.right.key:
            node.right = rotate_right(node.right)
            return rotate_left(node)

        return node

    def inorder(node: 'Node | None', result: list[int]) -> None:
        if node:
            inorder(node.left, result)
            result.append(node.key)
            inorder(node.right, result)

    root = None
    for val in arr:
        root = insert(root, val)

    result: list[int] = []
    inorder(root, result)
    return result

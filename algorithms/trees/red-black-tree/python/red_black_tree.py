def rb_insert_inorder(arr: list[int]) -> list[int]:
    RED = True
    BLACK = False

    class Node:
        def __init__(self, key: int):
            self.key = key
            self.left: 'Node | None' = None
            self.right: 'Node | None' = None
            self.parent: 'Node | None' = None
            self.color: bool = RED

    root: Node | None = None

    def rotate_left(x: Node) -> None:
        nonlocal root
        y = x.right
        x.right = y.left
        if y.left:
            y.left.parent = x
        y.parent = x.parent
        if x.parent is None:
            root = y
        elif x == x.parent.left:
            x.parent.left = y
        else:
            x.parent.right = y
        y.left = x
        x.parent = y

    def rotate_right(x: Node) -> None:
        nonlocal root
        y = x.left
        x.left = y.right
        if y.right:
            y.right.parent = x
        y.parent = x.parent
        if x.parent is None:
            root = y
        elif x == x.parent.right:
            x.parent.right = y
        else:
            x.parent.left = y
        y.right = x
        x.parent = y

    def fix_insert(z: Node) -> None:
        nonlocal root
        while z.parent and z.parent.color == RED:
            if z.parent == z.parent.parent.left if z.parent.parent else False:
                y = z.parent.parent.right
                if y and y.color == RED:
                    z.parent.color = BLACK
                    y.color = BLACK
                    z.parent.parent.color = RED
                    z = z.parent.parent
                else:
                    if z == z.parent.right:
                        z = z.parent
                        rotate_left(z)
                    z.parent.color = BLACK
                    z.parent.parent.color = RED
                    rotate_right(z.parent.parent)
            else:
                y = z.parent.parent.left if z.parent.parent else None
                if y and y.color == RED:
                    z.parent.color = BLACK
                    y.color = BLACK
                    z.parent.parent.color = RED
                    z = z.parent.parent
                else:
                    if z == z.parent.left:
                        z = z.parent
                        rotate_right(z)
                    z.parent.color = BLACK
                    z.parent.parent.color = RED
                    rotate_left(z.parent.parent)
        root.color = BLACK

    def insert(key: int) -> None:
        nonlocal root
        node = Node(key)
        y = None
        x = root
        while x:
            y = x
            if key < x.key:
                x = x.left
            elif key > x.key:
                x = x.right
            else:
                return  # duplicate
        node.parent = y
        if y is None:
            root = node
        elif key < y.key:
            y.left = node
        else:
            y.right = node
        fix_insert(node)

    def inorder(node: 'Node | None', result: list[int]) -> None:
        if node:
            inorder(node.left, result)
            result.append(node.key)
            inorder(node.right, result)

    for val in arr:
        insert(val)

    result: list[int] = []
    inorder(root, result)
    return result

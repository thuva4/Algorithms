class Node:
    def __init__(self, key: int) -> None:
        self.key = key
        self.left: Node | None = None
        self.right: Node | None = None


def _insert(root: Node | None, key: int) -> Node:
    if root is None:
        return Node(key)
    if key <= root.key:
        root.left = _insert(root.left, key)
    else:
        root.right = _insert(root.right, key)
    return root


def _inorder(root: Node | None, result: list[int]) -> None:
    if root is None:
        return
    _inorder(root.left, result)
    result.append(root.key)
    _inorder(root.right, result)


def bst_inorder(arr: list[int]) -> list[int]:
    root: Node | None = None
    for key in arr:
        root = _insert(root, key)

    result: list[int] = []
    _inorder(root, result)
    return result

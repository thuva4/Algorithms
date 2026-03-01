def tree_traversals(arr: list[int]) -> list[int]:
    result = []
    def inorder(i):
        if i >= len(arr) or arr[i] == -1:
            return
        inorder(2 * i + 1)
        result.append(arr[i])
        inorder(2 * i + 2)
    inorder(0)
    return result

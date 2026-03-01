class Node:
    def __init__(self, key):
        self.left = None
        self.right = None
        self.val = key

def insert(root, key):
    if root is None:
        return Node(key)
    else:
        if key < root.val:
            root.left = insert(root.left, key)
        else:
            root.right = insert(root.right, key)
    return root

def store_sorted(root, arr, index):
    if root is not None:
        index = store_sorted(root.left, arr, index)
        arr[index] = root.val
        index += 1
        index = store_sorted(root.right, arr, index)
    return index

def tree_sort(arr):
    if not arr:
        return arr
        
    root = None
    for x in arr:
        root = insert(root, x)
        
    store_sorted(root, arr, 0)
    return arr

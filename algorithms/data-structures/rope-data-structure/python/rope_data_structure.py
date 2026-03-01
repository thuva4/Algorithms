class RopeNode:
    def __init__(self, data=None):
        self.left = None
        self.right = None
        self.weight = 0
        self.data = data
        if data is not None:
            self.weight = len(data)


def build_rope(arr):
    if len(arr) <= 4:
        return RopeNode(arr[:])
    mid = len(arr) // 2
    node = RopeNode()
    node.left = build_rope(arr[:mid])
    node.right = build_rope(arr[mid:])
    node.weight = mid
    return node


def concat_rope(r1, r2):
    node = RopeNode()
    node.left = r1
    node.right = r2
    node.weight = rope_length(r1)
    return node


def rope_length(node):
    if node is None:
        return 0
    if node.data is not None:
        return len(node.data)
    return node.weight + rope_length(node.right)


def index_rope(node, idx):
    if node.data is not None:
        return node.data[idx]
    if idx < node.weight:
        return index_rope(node.left, idx)
    return index_rope(node.right, idx - node.weight)


def rope_data_structure(data):
    n1 = data[0]
    arr1 = data[1:1 + n1]
    pos = 1 + n1
    n2 = data[pos]
    arr2 = data[pos + 1:pos + 1 + n2]
    query_index = data[pos + 1 + n2]

    r1 = build_rope(arr1)
    r2 = build_rope(arr2)
    combined = concat_rope(r1, r2)
    return index_rope(combined, query_index)


if __name__ == "__main__":
    print(rope_data_structure([3, 1, 2, 3, 2, 4, 5, 0]))
    print(rope_data_structure([3, 1, 2, 3, 2, 4, 5, 4]))
    print(rope_data_structure([3, 1, 2, 3, 2, 4, 5, 3]))

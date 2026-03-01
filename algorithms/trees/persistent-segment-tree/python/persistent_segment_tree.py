import sys


class Node:
    __slots__ = ['left', 'right', 'val']
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def build(arr, s, e):
    if s == e:
        return Node(arr[s])
    m = (s + e) // 2
    left = build(arr, s, m)
    right = build(arr, m + 1, e)
    return Node(left.val + right.val, left, right)


def update(node, s, e, idx, val):
    if s == e:
        return Node(val)
    m = (s + e) // 2
    if idx <= m:
        new_left = update(node.left, s, m, idx, val)
        return Node(new_left.val + node.right.val, new_left, node.right)
    else:
        new_right = update(node.right, m + 1, e, idx, val)
        return Node(node.left.val + new_right.val, node.left, new_right)


def query(node, s, e, l, r):
    if r < s or e < l:
        return 0
    if l <= s and e <= r:
        return node.val
    m = (s + e) // 2
    return query(node.left, s, m, l, r) + query(node.right, m + 1, e, l, r)


def persistent_segment_tree(n, arr, operations):
    roots = [build(arr, 0, n - 1)]
    results = []
    for op in operations:
        if op[0] == 1:
            ver, idx, val = op[1], op[2], op[3]
            new_root = update(roots[ver], 0, n - 1, idx, val)
            roots.append(new_root)
        else:
            ver, l, r = op[1], op[2], op[3]
            results.append(query(roots[ver], 0, n - 1, l, r))
    return results


if __name__ == "__main__":
    data = sys.stdin.read().split()
    idx = 0
    n = int(data[idx]); idx += 1
    arr = [int(data[idx + i]) for i in range(n)]; idx += n
    q = int(data[idx]); idx += 1
    operations = []
    for _ in range(q):
        t = int(data[idx]); idx += 1
        a = int(data[idx]); idx += 1
        b = int(data[idx]); idx += 1
        c = int(data[idx]); idx += 1
        operations.append((t, a, b, c))
    result = persistent_segment_tree(n, arr, operations)
    print(' '.join(map(str, result)))

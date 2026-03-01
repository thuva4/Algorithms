import sys


class SegTreeLazy:
    def __init__(self, arr):
        self.n = len(arr)
        self.tree = [0] * (4 * self.n)
        self.lazy = [0] * (4 * self.n)
        self._build(arr, 1, 0, self.n - 1)

    def _build(self, arr, node, start, end):
        if start == end:
            self.tree[node] = arr[start]
        else:
            mid = (start + end) // 2
            self._build(arr, 2 * node, start, mid)
            self._build(arr, 2 * node + 1, mid + 1, end)
            self.tree[node] = self.tree[2 * node] + self.tree[2 * node + 1]

    def _push_down(self, node, start, end):
        if self.lazy[node] != 0:
            mid = (start + end) // 2
            self._apply(2 * node, start, mid, self.lazy[node])
            self._apply(2 * node + 1, mid + 1, end, self.lazy[node])
            self.lazy[node] = 0

    def _apply(self, node, start, end, val):
        self.tree[node] += val * (end - start + 1)
        self.lazy[node] += val

    def update(self, l, r, val):
        self._update(1, 0, self.n - 1, l, r, val)

    def _update(self, node, start, end, l, r, val):
        if r < start or end < l:
            return
        if l <= start and end <= r:
            self._apply(node, start, end, val)
            return
        self._push_down(node, start, end)
        mid = (start + end) // 2
        self._update(2 * node, start, mid, l, r, val)
        self._update(2 * node + 1, mid + 1, end, l, r, val)
        self.tree[node] = self.tree[2 * node] + self.tree[2 * node + 1]

    def query(self, l, r):
        return self._query(1, 0, self.n - 1, l, r)

    def _query(self, node, start, end, l, r):
        if r < start or end < l:
            return 0
        if l <= start and end <= r:
            return self.tree[node]
        self._push_down(node, start, end)
        mid = (start + end) // 2
        return self._query(2 * node, start, mid, l, r) + \
               self._query(2 * node + 1, mid + 1, end, l, r)


def segment_tree_lazy(n, arr, operations):
    st = SegTreeLazy(arr)
    results = []
    for op in operations:
        if op[0] == 1:
            st.update(op[1], op[2], op[3])
        else:
            results.append(st.query(op[1], op[2]))
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
        l = int(data[idx]); idx += 1
        r = int(data[idx]); idx += 1
        v = int(data[idx]); idx += 1
        operations.append((t, l, r, v))
    result = segment_tree_lazy(n, arr, operations)
    print(' '.join(map(str, result)))

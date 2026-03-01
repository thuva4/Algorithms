import sys
from bisect import bisect_right


class MergeSortTree:
    def __init__(self, arr):
        self.n = len(arr)
        self.tree = [[] for _ in range(4 * self.n)]
        self._build(arr, 1, 0, self.n - 1)

    def _build(self, arr, nd, s, e):
        if s == e:
            self.tree[nd] = [arr[s]]
            return
        m = (s + e) // 2
        self._build(arr, 2 * nd, s, m)
        self._build(arr, 2 * nd + 1, m + 1, e)
        self.tree[nd] = self._merge(self.tree[2 * nd], self.tree[2 * nd + 1])

    def _merge(self, a, b):
        result = []
        i, j = 0, 0
        while i < len(a) and j < len(b):
            if a[i] <= b[j]:
                result.append(a[i]); i += 1
            else:
                result.append(b[j]); j += 1
        result.extend(a[i:])
        result.extend(b[j:])
        return result

    def count_leq(self, l, r, k):
        return self._query(1, 0, self.n - 1, l, r, k)

    def _query(self, nd, s, e, l, r, k):
        if r < s or e < l:
            return 0
        if l <= s and e <= r:
            return bisect_right(self.tree[nd], k)
        m = (s + e) // 2
        return self._query(2 * nd, s, m, l, r, k) + \
               self._query(2 * nd + 1, m + 1, e, l, r, k)


def merge_sort_tree(n, arr, queries):
    mst = MergeSortTree(arr)
    return [mst.count_leq(l, r, k) for l, r, k in queries]


if __name__ == "__main__":
    data = sys.stdin.read().split()
    idx = 0
    n = int(data[idx]); idx += 1
    arr = [int(data[idx + i]) for i in range(n)]; idx += n
    q = int(data[idx]); idx += 1
    queries = []
    for _ in range(q):
        l = int(data[idx]); idx += 1
        r = int(data[idx]); idx += 1
        k = int(data[idx]); idx += 1
        queries.append((l, r, k))
    result = merge_sort_tree(n, arr, queries)
    print(' '.join(map(str, result)))

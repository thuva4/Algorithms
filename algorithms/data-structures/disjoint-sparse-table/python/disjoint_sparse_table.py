import sys


class DisjointSparseTable:
    """Disjoint Sparse Table for O(1) range sum queries."""

    def __init__(self, arr):
        self.n = len(arr)
        # Round up to next power of 2
        self.sz = 1
        self.levels = 0
        while self.sz < self.n:
            self.sz <<= 1
            self.levels += 1
        if self.levels == 0:
            self.levels = 1

        # Pad array
        self.a = arr[:] + [0] * (self.sz - self.n)
        self.table = [[0] * self.sz for _ in range(self.levels)]
        self._build()

    def _build(self):
        if self.sz == 1:
            self.table[0][0] = self.a[0]
            return
        for level in range(self.levels):
            block = 1 << (level + 1)
            half = block >> 1
            for start in range(0, self.sz, block):
                mid = start + half
                # Right half: prefix sums from mid going right
                self.table[level][mid] = self.a[mid]
                for i in range(mid + 1, min(start + block, self.sz)):
                    self.table[level][i] = self.table[level][i - 1] + self.a[i]
                # Left half: suffix sums from mid-1 going left
                if mid - 1 >= start:
                    self.table[level][mid - 1] = self.a[mid - 1]
                    for i in range(mid - 2, start - 1, -1):
                        self.table[level][i] = self.table[level][i + 1] + self.a[i]

    def query(self, l, r):
        """Return sum of arr[l..r] (0-indexed, inclusive)."""
        if l == r:
            return self.a[l]
        # Find the highest differing bit
        level = (l ^ r).bit_length() - 1
        return self.table[level][l] + self.table[level][r]


def disjoint_sparse_table(n, arr, queries):
    dst = DisjointSparseTable(arr)
    return [dst.query(l, r) for l, r in queries]


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
        queries.append((l, r))
    result = disjoint_sparse_table(n, arr, queries)
    print(' '.join(map(str, result)))

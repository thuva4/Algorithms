import sys


class BIT2D:
    def __init__(self, rows, cols):
        self.rows = rows
        self.cols = cols
        self.tree = [[0] * (cols + 1) for _ in range(rows + 1)]

    def update(self, r, c, val):
        """Add val to position (r, c) (0-indexed)."""
        r += 1; c += 1
        i = r
        while i <= self.rows:
            j = c
            while j <= self.cols:
                self.tree[i][j] += val
                j += j & (-j)
            i += i & (-i)

    def query(self, r, c):
        """Prefix sum from (0,0) to (r,c) (0-indexed, inclusive)."""
        r += 1; c += 1
        s = 0
        i = r
        while i > 0:
            j = c
            while j > 0:
                s += self.tree[i][j]
                j -= j & (-j)
            i -= i & (-i)
        return s


def binary_indexed_tree_2d(rows, cols, matrix, operations):
    bit = BIT2D(rows, cols)
    for r in range(rows):
        for c in range(cols):
            if matrix[r][c] != 0:
                bit.update(r, c, matrix[r][c])
    results = []
    for op in operations:
        if op[0] == 1:
            bit.update(op[1], op[2], op[3])
        else:
            results.append(bit.query(op[1], op[2]))
    return results


if __name__ == "__main__":
    data = sys.stdin.read().split()
    idx = 0
    rows = int(data[idx]); idx += 1
    cols = int(data[idx]); idx += 1
    matrix = []
    for r in range(rows):
        row = [int(data[idx + c]) for c in range(cols)]
        idx += cols
        matrix.append(row)
    q = int(data[idx]); idx += 1
    operations = []
    for _ in range(q):
        t = int(data[idx]); idx += 1
        r = int(data[idx]); idx += 1
        c = int(data[idx]); idx += 1
        v = int(data[idx]); idx += 1
        operations.append((t, r, c, v))
    result = binary_indexed_tree_2d(rows, cols, matrix, operations)
    print(' '.join(map(str, result)))

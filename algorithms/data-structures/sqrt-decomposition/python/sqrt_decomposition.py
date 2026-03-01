import sys
import math


class SqrtDecomposition:
    """Range sum queries using sqrt decomposition."""

    def __init__(self, arr):
        self.n = len(arr)
        self.block = max(1, int(math.isqrt(self.n)))
        self.a = arr[:]
        self.blocks = [0] * ((self.n + self.block - 1) // self.block)
        for i in range(self.n):
            self.blocks[i // self.block] += self.a[i]

    def query(self, l, r):
        """Return sum of arr[l..r] (0-indexed, inclusive)."""
        result = 0
        bl = l // self.block
        br = r // self.block
        if bl == br:
            for i in range(l, r + 1):
                result += self.a[i]
        else:
            for i in range(l, (bl + 1) * self.block):
                result += self.a[i]
            for b in range(bl + 1, br):
                result += self.blocks[b]
            for i in range(br * self.block, r + 1):
                result += self.a[i]
        return result


def sqrt_decomposition(n, arr, queries):
    sd = SqrtDecomposition(arr)
    return [sd.query(l, r) for l, r in queries]


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
    result = sqrt_decomposition(n, arr, queries)
    print(' '.join(map(str, result)))

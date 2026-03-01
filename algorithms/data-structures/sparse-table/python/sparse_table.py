import sys
import math


def build_sparse_table(arr):
    """Build sparse table for range minimum queries."""
    n = len(arr)
    if n == 0:
        return []
    k = max(1, int(math.log2(n)) + 1)
    table = [[0] * n for _ in range(k)]
    table[0] = arr[:]
    for j in range(1, k):
        for i in range(n - (1 << j) + 1):
            table[j][i] = min(table[j-1][i], table[j-1][i + (1 << (j-1))])
    return table


def query(table, l, r):
    """Query minimum in range [l, r] (0-indexed, inclusive)."""
    length = r - l + 1
    k = int(math.log2(length))
    return min(table[k][l], table[k][r - (1 << k) + 1])


def sparse_table(n, arr, queries):
    """Process all range minimum queries."""
    table = build_sparse_table(arr)
    return [query(table, l, r) for l, r in queries]


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
    result = sparse_table(n, arr, queries)
    print(' '.join(map(str, result)))

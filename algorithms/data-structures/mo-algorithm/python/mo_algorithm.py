import sys
import math


def mo_algorithm(n, arr, queries):
    """Answer range sum queries offline using Mo's algorithm."""
    block = max(1, int(math.isqrt(n)))
    q = len(queries)
    # Attach original index
    indexed = [(l, r, i) for i, (l, r) in enumerate(queries)]
    indexed.sort(key=lambda x: (x[0] // block, x[1] if (x[0] // block) % 2 == 0 else -x[1]))

    results = [0] * q
    cur_l, cur_r = 0, -1
    cur_sum = 0

    for l, r, idx in indexed:
        while cur_r < r:
            cur_r += 1
            cur_sum += arr[cur_r]
        while cur_l > l:
            cur_l -= 1
            cur_sum += arr[cur_l]
        while cur_r > r:
            cur_sum -= arr[cur_r]
            cur_r -= 1
        while cur_l < l:
            cur_sum -= arr[cur_l]
            cur_l += 1
        results[idx] = cur_sum

    return results


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
    result = mo_algorithm(n, arr, queries)
    print(' '.join(map(str, result)))

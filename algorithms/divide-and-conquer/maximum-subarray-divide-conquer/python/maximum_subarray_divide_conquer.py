import sys


def max_subarray_dc(arr):
    """Find maximum subarray sum using divide and conquer."""
    def helper(lo, hi):
        if lo == hi:
            return arr[lo]
        mid = (lo + hi) // 2

        # Max crossing subarray
        left_sum = float('-inf')
        s = 0
        for i in range(mid, lo - 1, -1):
            s += arr[i]
            left_sum = max(left_sum, s)
        right_sum = float('-inf')
        s = 0
        for i in range(mid + 1, hi + 1):
            s += arr[i]
            right_sum = max(right_sum, s)

        cross = left_sum + right_sum
        left_max = helper(lo, mid)
        right_max = helper(mid + 1, hi)
        return max(left_max, right_max, cross)

    return helper(0, len(arr) - 1)


if __name__ == "__main__":
    data = sys.stdin.read().split()
    idx = 0
    n = int(data[idx]); idx += 1
    arr = [int(data[idx + i]) for i in range(n)]
    print(max_subarray_dc(arr))

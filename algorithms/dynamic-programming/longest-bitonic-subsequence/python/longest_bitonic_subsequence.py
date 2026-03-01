def longest_bitonic_subsequence(arr):
    n = len(arr)
    if n == 0:
        return 0

    lis = [1] * n
    lds = [1] * n

    # Compute LIS from left to right
    for i in range(1, n):
        for j in range(i):
            if arr[j] < arr[i] and lis[j] + 1 > lis[i]:
                lis[i] = lis[j] + 1

    # Compute LDS from right to left
    for i in range(n - 2, -1, -1):
        for j in range(n - 1, i, -1):
            if arr[j] < arr[i] and lds[j] + 1 > lds[i]:
                lds[i] = lds[j] + 1

    return max(lis[i] + lds[i] - 1 for i in range(n))


if __name__ == "__main__":
    arr = [1, 3, 4, 2, 6, 1]
    print(longest_bitonic_subsequence(arr))  # 5

def z_function(arr: list[int]) -> list[int]:
    n = len(arr)
    if n == 0:
        return []
    z = [0] * n
    l, r = 0, 0
    for i in range(1, n):
        if i < r:
            z[i] = min(r - i, z[i - l])
        while i + z[i] < n and arr[z[i]] == arr[i + z[i]]:
            z[i] += 1
        if i + z[i] > r:
            l, r = i, i + z[i]
    return z

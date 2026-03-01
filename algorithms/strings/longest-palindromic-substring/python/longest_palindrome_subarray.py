def longest_palindrome_subarray(arr: list[int]) -> int:
    n = len(arr)
    if n == 0:
        return 0

    def expand(l, r):
        while l >= 0 and r < n and arr[l] == arr[r]:
            l -= 1
            r += 1
        return r - l - 1

    max_len = 1
    for i in range(n):
        odd = expand(i, i)
        even = expand(i, i + 1)
        max_len = max(max_len, odd, even)

    return max_len

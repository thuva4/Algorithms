def lz77_compression(arr):
    """
    Simplified LZ77: count back-references in a sliding window.
    A back-reference is found when at position i, there exists a match of
    length >= 2 starting at some earlier position in the window.

    Returns: number of back-references found
    """
    n = len(arr)
    window_size = 256
    count = 0
    i = 0

    while i < n:
        best_len = 0
        start = max(0, i - window_size)

        for j in range(start, i):
            length = 0
            while i + length < n and length < (i - j) and arr[j + length] == arr[i + length]:
                length += 1
            # Also allow repeating copy (overlapping)
            if length == i - j:
                while i + length < n and arr[j + (length % (i - j))] == arr[i + length]:
                    length += 1
            if length > best_len:
                best_len = length

        if best_len >= 2:
            count += 1
            i += best_len
        else:
            i += 1

    return count


if __name__ == "__main__":
    print(lz77_compression([1, 2, 3, 1, 2, 3]))       # 1
    print(lz77_compression([5, 5, 5, 5]))             # 1
    print(lz77_compression([1, 2, 3, 4]))             # 0
    print(lz77_compression([1, 2, 1, 2, 3, 4, 3, 4])) # 2

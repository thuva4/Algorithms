def longest_subset_zero_sum(arr):
    n = len(arr)
    max_len = 0
    sum_map = {0: -1}
    prefix_sum = 0

    for i in range(n):
        prefix_sum += arr[i]
        if prefix_sum in sum_map:
            length = i - sum_map[prefix_sum]
            max_len = max(max_len, length)
        else:
            sum_map[prefix_sum] = i

    return max_len


if __name__ == "__main__":
    arr = [1, 2, -3, 3]
    print(longest_subset_zero_sum(arr))  # 3

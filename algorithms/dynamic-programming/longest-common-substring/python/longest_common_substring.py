def longest_common_substring(arr1, arr2):
    """
    Find the length of the longest contiguous subarray common to both arrays.

    arr1: first list of integers
    arr2: second list of integers
    Returns: length of the longest common contiguous subarray
    """
    n = len(arr1)
    m = len(arr2)
    max_len = 0

    # dp[i][j] = length of longest common suffix ending at arr1[i-1] and arr2[j-1]
    dp = [[0] * (m + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if arr1[i - 1] == arr2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
                if dp[i][j] > max_len:
                    max_len = dp[i][j]
            else:
                dp[i][j] = 0

    return max_len


if __name__ == "__main__":
    print(longest_common_substring([1, 2, 3, 4, 5], [3, 4, 5, 6, 7]))  # 3
    print(longest_common_substring([1, 2, 3], [4, 5, 6]))              # 0
    print(longest_common_substring([1, 2, 3, 4], [1, 2, 3, 4]))        # 4
    print(longest_common_substring([1], [1]))                            # 1
    print(longest_common_substring([1, 2, 3, 2, 1], [3, 2, 1, 4, 7]))  # 3

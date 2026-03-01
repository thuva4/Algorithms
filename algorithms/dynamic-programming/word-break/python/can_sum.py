def can_sum(arr, target):
    """
    Determine if target can be formed by summing elements from arr
    with repetition allowed.

    arr: list of positive integers (available elements)
    target: the target sum to reach
    Returns: 1 if target is achievable, 0 otherwise
    """
    if target == 0:
        return 1

    dp = [False] * (target + 1)
    dp[0] = True

    for i in range(1, target + 1):
        for elem in arr:
            if elem <= i and dp[i - elem]:
                dp[i] = True
                break

    return 1 if dp[target] else 0


if __name__ == "__main__":
    print(can_sum([2, 3], 7))   # 1 (2+2+3)
    print(can_sum([5, 3], 8))   # 1 (3+5)
    print(can_sum([2, 4], 7))   # 0
    print(can_sum([1], 5))      # 1 (1+1+1+1+1)
    print(can_sum([7], 3))      # 0

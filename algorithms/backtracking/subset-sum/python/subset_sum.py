def subset_sum(arr: list[int], target: int) -> int:
    """Determine if any subset of arr sums to target.

    Returns 1 if such a subset exists, 0 otherwise.
    """

    def backtrack(index: int, remaining: int) -> bool:
        if remaining == 0:
            return True
        if index >= len(arr):
            return False
        # Include arr[index]
        if backtrack(index + 1, remaining - arr[index]):
            return True
        # Exclude arr[index]
        if backtrack(index + 1, remaining):
            return True
        return False

    return 1 if backtrack(0, target) else 0

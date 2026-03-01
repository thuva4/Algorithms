def lis(array_of_integers: list[int]) -> int:
    if not array_of_integers:
        return 0
    tails: list[int] = []
    for value in array_of_integers:
        left = 0
        right = len(tails)
        while left < right:
            mid = (left + right) // 2
            if tails[mid] < value:
                left = mid + 1
            else:
                right = mid
        if left == len(tails):
            tails.append(value)
        else:
            tails[left] = value
    return len(tails)

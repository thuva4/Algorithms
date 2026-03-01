def count_set_bits(arr: list[int]) -> int:
    total = 0
    for num in arr:
        while num:
            total += 1
            num &= num - 1
    return total

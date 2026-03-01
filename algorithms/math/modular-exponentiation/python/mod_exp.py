def mod_exp(arr: list[int]) -> int:
    base, exp, mod = arr[0], arr[1], arr[2]
    if mod == 1:
        return 0
    result = 1
    base = base % mod
    while exp > 0:
        if exp % 2 == 1:
            result = (result * base) % mod
        exp = exp >> 1
        base = (base * base) % mod
    return result

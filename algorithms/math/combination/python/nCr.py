from math import comb


def nCr(n: int, r: int) -> int:
    if r < 0 or r > n:
        return 0
    return comb(n, r)

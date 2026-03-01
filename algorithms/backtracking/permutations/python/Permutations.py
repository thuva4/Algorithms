from itertools import permutations as _permutations


def permutations(array: list[int]) -> list[list[int]]:
    return [list(item) for item in _permutations(array)] if array else [[]]

def sumset(set_a: list[int], set_b: list[int]) -> list[int]:
    return sorted(a + b for a in set_a for b in set_b)

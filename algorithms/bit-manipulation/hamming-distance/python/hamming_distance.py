def hamming_distance(a: int, b: int) -> int:
    return (a ^ b).bit_count()

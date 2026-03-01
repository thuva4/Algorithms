def euler_totient(n: int) -> int:
    if n <= 0:
        return 0
    result = n
    factor = 2
    value = n
    while factor * factor <= value:
        if value % factor == 0:
            while value % factor == 0:
                value //= factor
            result -= result // factor
        factor += 1
    if value > 1:
        result -= result // value
    return result

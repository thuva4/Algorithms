def factorial(n: int) -> int:
    result = 1
    for value in range(2, n + 1):
        result *= value
    return result

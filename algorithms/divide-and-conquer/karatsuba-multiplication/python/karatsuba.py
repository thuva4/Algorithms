def karatsuba(arr: list[int]) -> int:
    a, b = arr[0], arr[1]

    def multiply(x: int, y: int) -> int:
        if x < 10 or y < 10:
            return x * y

        n = max(len(str(abs(x))), len(str(abs(y))))
        half = n // 2
        power = 10 ** half

        x1, x0 = divmod(x, power)
        y1, y0 = divmod(y, power)

        z0 = multiply(x0, y0)
        z2 = multiply(x1, y1)
        z1 = multiply(x0 + x1, y0 + y1) - z0 - z2

        return z2 * (power * power) + z1 * power + z0

    return multiply(a, b)

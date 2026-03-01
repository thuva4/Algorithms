def integer_sqrt(arr: list[int]) -> int:
    n = arr[0]
    if n <= 1:
        return n
    x = n
    while True:
        x1 = (x + n // x) // 2
        if x1 >= x:
            return x
        x = x1

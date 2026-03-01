def miller_rabin(n: int) -> int:
    if n < 2:
        return 0
    if n < 4:
        return 1
    if n % 2 == 0:
        return 0

    # Write n-1 as 2^r * d
    r, d = 0, n - 1
    while d % 2 == 0:
        r += 1
        d //= 2

    # Deterministic witnesses for n < 3,215,031,751
    witnesses = [2, 3, 5, 7]

    for a in witnesses:
        if a >= n:
            continue

        x = pow(a, d, n)
        if x == 1 or x == n - 1:
            continue

        found = False
        for _ in range(r - 1):
            x = pow(x, 2, n)
            if x == n - 1:
                found = True
                break

        if not found:
            return 0

    return 1

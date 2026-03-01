def chinese_remainder(arr: list[int]) -> int:
    n = arr[0]
    remainders = []
    moduli = []
    for i in range(n):
        remainders.append(arr[1 + 2 * i])
        moduli.append(arr[2 + 2 * i])

    def extended_gcd(a, b):
        if a == 0:
            return b, 0, 1
        g, x1, y1 = extended_gcd(b % a, a)
        return g, y1 - (b // a) * x1, x1

    r = remainders[0]
    m = moduli[0]

    for i in range(1, n):
        r2 = remainders[i]
        m2 = moduli[i]
        g, p, _ = extended_gcd(m, m2)
        lcm = m * m2 // g
        r = (r + m * ((r2 - r) // g) * p) % lcm
        m = lcm

    return r % m if m > 0 else r

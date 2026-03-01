def lucas_theorem(n, k, p):
    if k > n:
        return 0

    # Precompute factorials mod p
    fact = [1] * p
    for i in range(1, p):
        fact[i] = fact[i - 1] * i % p

    def mod_inv(a, m):
        return pow(a, m - 2, m)

    def comb_small(a, b):
        if b > a:
            return 0
        if b == 0 or a == b:
            return 1
        return fact[a] * mod_inv(fact[b], p) % p * mod_inv(fact[a - b], p) % p

    result = 1
    while n > 0 or k > 0:
        ni = n % p
        ki = k % p
        if ki > ni:
            return 0
        result = result * comb_small(ni, ki) % p
        n //= p
        k //= p

    return result


if __name__ == "__main__":
    print(lucas_theorem(10, 3, 7))
    print(lucas_theorem(5, 2, 3))
    print(lucas_theorem(100, 50, 13))
    print(lucas_theorem(3, 5, 7))
    print(lucas_theorem(0, 0, 5))

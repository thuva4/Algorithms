def catalan_numbers(n: int) -> int:
    MOD = 1000000007

    def mod_pow(base, exp, mod):
        result = 1
        base %= mod
        while exp > 0:
            if exp % 2 == 1:
                result = result * base % mod
            exp //= 2
            base = base * base % mod
        return result

    def mod_inv(a, mod):
        return mod_pow(a, mod - 2, mod)

    result = 1
    for i in range(1, n + 1):
        result = result * (2 * (2 * i - 1)) % MOD
        result = result * mod_inv(i + 1, MOD) % MOD

    return result

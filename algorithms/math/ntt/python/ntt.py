MOD = 998244353
G = 3  # primitive root


def mod_pow(base, exp, mod):
    result = 1
    base %= mod
    while exp > 0:
        if exp & 1:
            result = result * base % mod
        exp >>= 1
        base = base * base % mod
    return result


def ntt_transform(a, invert):
    n = len(a)
    j = 0
    for i in range(1, n):
        bit = n >> 1
        while j & bit:
            j ^= bit
            bit >>= 1
        j ^= bit
        if i < j:
            a[i], a[j] = a[j], a[i]

    length = 2
    while length <= n:
        w = mod_pow(G, (MOD - 1) // length, MOD)
        if invert:
            w = mod_pow(w, MOD - 2, MOD)
        half = length // 2
        for i in range(0, n, length):
            wn = 1
            for k in range(half):
                u = a[i + k]
                v = a[i + k + half] * wn % MOD
                a[i + k] = (u + v) % MOD
                a[i + k + half] = (u - v) % MOD
                wn = wn * w % MOD
        length <<= 1

    if invert:
        inv_n = mod_pow(n, MOD - 2, MOD)
        for i in range(n):
            a[i] = a[i] * inv_n % MOD


def ntt(data):
    idx = 0
    na = data[idx]; idx += 1
    a = data[idx:idx + na]; idx += na
    nb = data[idx]; idx += 1
    b = data[idx:idx + nb]; idx += nb

    result_len = na + nb - 1
    n = 1
    while n < result_len:
        n <<= 1

    fa = [x % MOD for x in a] + [0] * (n - na)
    fb = [x % MOD for x in b] + [0] * (n - nb)

    ntt_transform(fa, False)
    ntt_transform(fb, False)

    for i in range(n):
        fa[i] = fa[i] * fb[i] % MOD

    ntt_transform(fa, True)

    return fa[:result_len]


if __name__ == "__main__":
    print(ntt([2, 1, 2, 2, 3, 4]))
    print(ntt([2, 1, 1, 2, 1, 1]))
    print(ntt([1, 5, 1, 3]))

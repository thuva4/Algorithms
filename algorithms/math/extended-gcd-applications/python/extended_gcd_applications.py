def extended_gcd_applications(arr):
    """Compute modular inverse of a mod m using extended GCD. Returns -1 if not exists."""
    a, m = arr[0], arr[1]

    def extended_gcd(a, b):
        if a == 0:
            return b, 0, 1
        g, x1, y1 = extended_gcd(b % a, a)
        return g, y1 - (b // a) * x1, x1

    g, x, _ = extended_gcd(a % m, m)
    if g != 1:
        return -1
    return (x % m + m) % m


if __name__ == "__main__":
    print(extended_gcd_applications([3, 7]))    # 5
    print(extended_gcd_applications([1, 13]))   # 1
    print(extended_gcd_applications([6, 9]))    # -1
    print(extended_gcd_applications([2, 11]))   # 6

import math


def is_prime(n):
    if n < 2:
        return False
    if n < 4:
        return True
    if n % 2 == 0 or n % 3 == 0:
        return False
    i = 5
    while i * i <= n:
        if n % i == 0 or n % (i + 2) == 0:
            return False
        i += 6
    return True


def rho(n):
    if n % 2 == 0:
        return 2
    x = 2
    y = 2
    c = 1
    d = 1
    while d == 1:
        x = (x * x + c) % n
        y = (y * y + c) % n
        y = (y * y + c) % n
        d = math.gcd(abs(x - y), n)
    if d != n:
        return d
    return n


def smallest_prime_factor(n):
    if n <= 1:
        return n
    if is_prime(n):
        return n
    factors = []
    stack = [n]
    while stack:
        num = stack.pop()
        if num == 1:
            continue
        if is_prime(num):
            factors.append(num)
            continue
        d = rho(num)
        if d == num:
            # Try different starting values
            for c in range(2, 20):
                x = 2
                y = 2
                d = 1
                while d == 1:
                    x = (x * x + c) % num
                    y = (y * y + c) % num
                    y = (y * y + c) % num
                    d = math.gcd(abs(x - y), num)
                if d != num:
                    break
        stack.append(d)
        stack.append(num // d)
    return min(factors) if factors else n


def pollards_rho(n):
    return smallest_prime_factor(n)


if __name__ == "__main__":
    print(pollards_rho(15))
    print(pollards_rho(13))
    print(pollards_rho(91))
    print(pollards_rho(221))

def euler_totient_sieve(n):
    phi = list(range(n + 1))
    for i in range(2, n + 1):
        if phi[i] == i:  # i is prime
            for j in range(i, n + 1, i):
                phi[j] -= phi[j] // i
    return sum(phi[1:])


if __name__ == "__main__":
    print(euler_totient_sieve(1))
    print(euler_totient_sieve(5))
    print(euler_totient_sieve(10))
    print(euler_totient_sieve(100))

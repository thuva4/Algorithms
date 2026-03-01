def mobius_function(n: int) -> int:
    if n <= 0:
        return 0
    mu = [1] * (n + 1)
    prime = [True] * (n + 1)
    for p in range(2, n + 1):
        if prime[p]:
            for multiple in range(p, n + 1, p):
                prime[multiple] = False
                mu[multiple] *= -1
            square = p * p
            for multiple in range(square, n + 1, square):
                mu[multiple] = 0
    return sum(mu[1:])

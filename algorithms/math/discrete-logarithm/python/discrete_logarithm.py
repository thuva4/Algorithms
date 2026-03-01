def discrete_logarithm(base, target, modulus):
    if modulus <= 1:
        return 0
    value = 1 % modulus
    for exponent in range(modulus):
        if value == target % modulus:
            return exponent
        value = (value * base) % modulus
    return -1


if __name__ == "__main__":
    print(discrete_logarithm(2, 8, 13))
    print(discrete_logarithm(5, 1, 7))
    print(discrete_logarithm(3, 3, 11))
    print(discrete_logarithm(3, 13, 17))

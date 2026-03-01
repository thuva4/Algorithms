def extended_gcd(a, b):
    if a == 0:
        return b, 0, 1
    g, x, y = extended_gcd(b % a, a)
    return g, y - (b // a) * x, x


def mod_inverse(e, phi):
    g, x, _ = extended_gcd(e % phi, phi)
    if g != 1:
        return -1
    return x % phi


def rsa_algorithm(p, q, e, message):
    n = p * q
    phi = (p - 1) * (q - 1)
    d = mod_inverse(e, phi)

    # Encrypt
    ciphertext = pow(message, e, n)

    # Decrypt
    plaintext = pow(ciphertext, d, n)

    return plaintext


if __name__ == "__main__":
    print(rsa_algorithm(61, 53, 17, 65))
    print(rsa_algorithm(61, 53, 17, 42))
    print(rsa_algorithm(11, 13, 7, 9))

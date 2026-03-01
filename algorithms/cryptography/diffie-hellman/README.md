# Diffie-Hellman Key Exchange

## Overview

The Diffie-Hellman key exchange is a cryptographic protocol that allows two parties to establish a shared secret key over an insecure communication channel, without ever transmitting the key itself. Invented by Whitfield Diffie and Martin Hellman in 1976, it was the first practical public-key protocol and remains foundational to modern secure communications.

The security of Diffie-Hellman relies on the computational difficulty of the discrete logarithm problem: given g, p, and g^a mod p, it is computationally infeasible to determine a. The protocol is used in TLS/SSL (HTTPS), SSH, VPNs, and virtually every secure communication system on the internet.

## How It Works

Both parties agree on a large prime p and a generator g (a primitive root modulo p). Each party generates a private random number, computes a public value by raising g to their private exponent modulo p, and exchanges the public value. Each party then raises the received public value to their private exponent to arrive at the same shared secret.

### Example

**Setup:** p = 23 (prime), g = 5 (generator)

| Step | Alice | Bob |
|------|-------|-----|
| 1. Choose private key | a = 6 (secret) | b = 15 (secret) |
| 2. Compute public key | A = g^a mod p = 5^6 mod 23 = 8 | B = g^b mod p = 5^15 mod 23 = 19 |
| 3. Exchange public keys | Alice sends A = 8 to Bob | Bob sends B = 19 to Alice |
| 4. Compute shared secret | s = B^a mod p = 19^6 mod 23 = 2 | s = A^b mod p = 8^15 mod 23 = 2 |

**Detailed computation of Alice's shared secret:**

| Step | Computation | Result |
|------|------------|--------|
| 1 | 19^1 mod 23 | 19 |
| 2 | 19^2 mod 23 | 361 mod 23 = 16 |
| 3 | 19^4 mod 23 | 16^2 mod 23 = 256 mod 23 = 3 |
| 4 | 19^6 mod 23 | 19^4 * 19^2 = 3 * 16 = 48 mod 23 = 2 |

**Both parties arrive at the same shared secret: `2`**

This works because: B^a = (g^b)^a = g^(ab) = (g^a)^b = A^b (mod p).

An eavesdropper who sees p = 23, g = 5, A = 8, and B = 19 would need to solve the discrete logarithm to find a or b, which is computationally infeasible for large primes (2048+ bits).

## Pseudocode

```
function diffieHellman():
    // Public parameters (agreed upon)
    p = large prime number
    g = primitive root modulo p

    // Alice's side
    a = random integer in [2, p - 2]
    A = modularExponentiation(g, a, p)
    send A to Bob

    // Bob's side
    b = random integer in [2, p - 2]
    B = modularExponentiation(g, b, p)
    send B to Alice

    // Compute shared secret
    alice_secret = modularExponentiation(B, a, p)
    bob_secret = modularExponentiation(A, b, p)

    // alice_secret == bob_secret
    return shared_secret

function modularExponentiation(base, exp, mod):
    result = 1
    base = base mod mod
    while exp > 0:
        if exp is odd:
            result = (result * base) mod mod
        exp = exp >> 1
        base = (base * base) mod mod
    return result
```

Modular exponentiation uses the square-and-multiply method to compute g^a mod p in O(log a) multiplications.

## Complexity Analysis

| Case    | Time     | Space |
|---------|---------|-------|
| Best    | O(log n) | O(1)  |
| Average | O(log n) | O(1)  |
| Worst   | O(log n) | O(1)  |

**Why these complexities?**

- **Best Case -- O(log n):** Modular exponentiation with the square-and-multiply method processes each bit of the exponent, requiring O(log n) multiplications where n is the size of the prime.

- **Average Case -- O(log n):** The number of modular multiplications is proportional to the number of bits in the exponent, which is log(p) for a prime p.

- **Worst Case -- O(log n):** The same as all cases. Each multiplication modulo p takes O(1) for hardware-supported sizes or O(k^2) for k-digit big integers.

- **Space -- O(1):** Only the private key, public key, and shared secret need to be stored. No arrays or data structures are required beyond the arithmetic operands.

## When to Use

- **Establishing shared secrets over insecure channels:** The primary use case -- two parties who have never communicated securely can agree on a shared key.
- **Forward secrecy:** Ephemeral Diffie-Hellman (with fresh random keys each session) provides forward secrecy, protecting past sessions even if long-term keys are compromised.
- **TLS/SSL handshakes:** Modern HTTPS connections use (Elliptic Curve) Diffie-Hellman for key exchange.
- **VPNs and SSH:** Secure tunnels use DH to establish session keys.

## When NOT to Use

- **Without authentication:** Bare Diffie-Hellman is vulnerable to man-in-the-middle attacks. It must be combined with authentication (certificates, digital signatures).
- **When one-way communication is needed:** DH requires interaction (both parties must exchange values). For non-interactive key exchange, use public-key encryption.
- **Small primes:** Using small primes makes the discrete logarithm easy to compute. Primes should be at least 2048 bits.
- **When quantum computers are a concern:** Shor's algorithm can solve the discrete logarithm problem efficiently. Use post-quantum key exchange (e.g., Kyber/CRYSTALS).

## Comparison with Similar Algorithms

| Protocol            | Type          | Security basis           | Notes                                    |
|--------------------|--------------|-------------------------|------------------------------------------|
| Diffie-Hellman      | Key exchange | Discrete logarithm       | Classic; requires large primes            |
| ECDH                | Key exchange | Elliptic curve DLP       | Smaller keys, same security; faster       |
| RSA Key Exchange    | Key exchange | Integer factorization    | One party chooses the secret              |
| Kyber (CRYSTALS)    | Key exchange | Lattice problems         | Post-quantum; NIST standard               |

## Implementations

| Language | File |
|----------|------|
| Python   | [DiffieHellman.py](python/DiffieHellman.py) |
| Go       | [DiffieHellman.go](go/DiffieHellman.go) |

## References

- Diffie, W., & Hellman, M. E. (1976). New directions in cryptography. *IEEE Transactions on Information Theory*, 22(6), 644-654.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 31: Number-Theoretic Algorithms.
- [Diffie-Hellman Key Exchange -- Wikipedia](https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange)

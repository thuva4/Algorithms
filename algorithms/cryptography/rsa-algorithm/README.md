# RSA Algorithm

## Overview

RSA (Rivest-Shamir-Adleman) is a public-key cryptosystem published in 1977, and it remains one of the most widely deployed asymmetric encryption algorithms. It enables secure communication between parties who have never shared a secret key by using a pair of mathematically linked keys: a public key for encryption and a private key for decryption.

The security of RSA rests on the computational difficulty of factoring the product of two large prime numbers. While multiplying two 1024-bit primes is trivial, factoring their 2048-bit product is computationally infeasible with current technology. RSA is used for digital signatures, key exchange, and encrypting small payloads in protocols like TLS/SSL, PGP, and S/MIME.

## How It Works

1. **Key Generation**:
   - Choose two distinct large primes p and q.
   - Compute n = p * q. This is the modulus for both the public and private keys.
   - Compute Euler's totient: phi(n) = (p - 1)(q - 1).
   - Choose a public exponent e such that 1 < e < phi(n) and gcd(e, phi(n)) = 1. A common choice is e = 65537.
   - Compute the private exponent d such that d * e = 1 (mod phi(n)), i.e., d is the modular multiplicative inverse of e modulo phi(n).
   - Public key: (n, e). Private key: (n, d).

2. **Encryption**: ciphertext c = m^e mod n, where m is the plaintext message (as an integer with m < n).

3. **Decryption**: plaintext m = c^d mod n.

**Correctness**: By Euler's theorem, m^(e*d) = m^(1 + k*phi(n)) = m * (m^phi(n))^k = m * 1^k = m (mod n), provided gcd(m, n) = 1.

## Worked Example

**Key Generation** with small primes p = 61, q = 53:

| Step | Computation | Result |
|------|------------|--------|
| Compute n | 61 * 53 | 3233 |
| Compute phi(n) | (61 - 1)(53 - 1) = 60 * 52 | 3120 |
| Choose e | e = 17 (gcd(17, 3120) = 1) | 17 |
| Compute d | 17 * d = 1 (mod 3120), d = 2753 | 2753 |

Public key: (n=3233, e=17). Private key: (n=3233, d=2753).

**Encryption** of message m = 65:

c = 65^17 mod 3233

Using repeated squaring:
| Step | Computation | Result |
|------|------------|--------|
| 65^1 mod 3233 | 65 | 65 |
| 65^2 mod 3233 | 4225 mod 3233 | 992 |
| 65^4 mod 3233 | 992^2 mod 3233 = 984064 mod 3233 | 2149 |
| 65^8 mod 3233 | 2149^2 mod 3233 = 4618201 mod 3233 | 2452 |
| 65^16 mod 3233 | 2452^2 mod 3233 = 6012304 mod 3233 | 2195 |
| 65^17 mod 3233 | 2195 * 65 mod 3233 = 142675 mod 3233 | 2790 |

Ciphertext: c = 2790

**Decryption**: m = 2790^2753 mod 3233 = 65 (the original message).

### Input/Output Format

- Input: `[p, q, e, message]`
- Output: the decrypted message (should equal the original message).

## Pseudocode

```
function rsaKeyGeneration(p, q, e):
    n = p * q
    phi = (p - 1) * (q - 1)
    d = modularInverse(e, phi)
    return (n, e, d)

function rsaEncrypt(message, e, n):
    return modularExponentiation(message, e, n)

function rsaDecrypt(ciphertext, d, n):
    return modularExponentiation(ciphertext, d, n)

function modularExponentiation(base, exp, mod):
    result = 1
    base = base mod mod
    while exp > 0:
        if exp is odd:
            result = (result * base) mod mod
        exp = exp >> 1
        base = (base * base) mod mod
    return result

function modularInverse(e, phi):
    // Extended Euclidean Algorithm
    (g, x, _) = extendedGCD(e, phi)
    if g != 1:
        error "Inverse does not exist"
    return x mod phi

function extendedGCD(a, b):
    if a == 0:
        return (b, 0, 1)
    (g, x1, y1) = extendedGCD(b mod a, a)
    return (g, y1 - (b / a) * x1, x1)
```

## Complexity Analysis

| Operation       | Time         | Space |
|----------------|-------------|-------|
| Key generation | O(k^4)      | O(k)  |
| Encryption     | O(k^2 log e)| O(k)  |
| Decryption     | O(k^2 log d)| O(k)  |

Where k is the number of bits in the modulus n.

**Why these complexities?**

- **Key generation -- O(k^4):** Finding large primes of k/2 bits requires generating random candidates and testing primality. The Miller-Rabin test runs in O(k^3) per test, and on average O(k) candidates must be tested (by the prime number theorem), giving O(k^4) overall. The modular inverse via the extended Euclidean algorithm is O(k^2), dominated by primality testing.

- **Encryption/Decryption -- O(k^2 log e):** Modular exponentiation uses the square-and-multiply method, performing O(log e) multiplications. Each multiplication of k-bit numbers takes O(k^2) with schoolbook multiplication (or O(k^1.585) with Karatsuba). Since e is typically small (e.g., 65537 = 2^16 + 1), encryption is fast. Decryption uses d which is O(k) bits, making it O(k^3) in the worst case.

- **Space -- O(k):** Only the key components (n, e, d, p, q) and intermediate arithmetic values are stored, each requiring O(k) bits.

## Applications

- **TLS/SSL certificates**: RSA signatures authenticate server identity in HTTPS connections. The server's certificate contains an RSA public key signed by a certificate authority.
- **Digital signatures**: RSA-PSS provides non-repudiation -- the signer cannot deny having signed a document. Used in code signing, legal documents, and email (S/MIME).
- **Key exchange**: RSA can transport a symmetric session key by encrypting it with the recipient's public key. The recipient decrypts with their private key.
- **PGP/GPG email encryption**: RSA key pairs are used to encrypt email messages and verify sender identity.
- **Secure Shell (SSH)**: RSA key pairs authenticate users to remote servers without passwords.

## When NOT to Use

- **Encrypting large data directly**: RSA can only encrypt messages smaller than the modulus (e.g., < 256 bytes for a 2048-bit key). For bulk data, use a hybrid scheme: encrypt the data with AES, then encrypt the AES key with RSA.
- **Performance-critical applications**: RSA is 100-1000x slower than symmetric ciphers like AES. Use RSA only for key exchange or signatures, not for bulk encryption.
- **Small key sizes**: RSA keys below 2048 bits are considered insecure. NIST recommends 2048-bit keys minimum, with 3072 or 4096 bits for long-term security.
- **Post-quantum environments**: Shor's algorithm can factor large integers efficiently on a quantum computer, breaking RSA entirely. For quantum-resistant cryptography, use lattice-based schemes like CRYSTALS-Dilithium (signatures) or CRYSTALS-Kyber (key exchange).
- **When forward secrecy is required**: Static RSA key exchange does not provide forward secrecy. If the private key is compromised, all past sessions encrypted with it can be decrypted. Use ephemeral Diffie-Hellman (ECDHE) instead.

## Comparison with Similar Algorithms

| Algorithm          | Type           | Security Basis            | Key Size (equiv. 128-bit) | Speed       |
|-------------------|---------------|--------------------------|--------------------------|-------------|
| RSA               | Asymmetric     | Integer factorization     | 3072 bits                | Slow        |
| Elliptic Curve (ECDSA) | Asymmetric | Elliptic curve DLP     | 256 bits                 | Moderate    |
| Diffie-Hellman    | Key exchange   | Discrete logarithm        | 3072 bits                | Moderate    |
| AES               | Symmetric      | Substitution-permutation  | 128 bits                 | Fast        |
| CRYSTALS-Dilithium| Asymmetric (PQ)| Lattice problems         | ~2528 bytes              | Fast        |

## Implementations

| Language   | File |
|------------|------|
| Python     | [rsa_algorithm.py](python/rsa_algorithm.py) |
| Java       | [RsaAlgorithm.java](java/RsaAlgorithm.java) |
| C++        | [rsa_algorithm.cpp](cpp/rsa_algorithm.cpp) |
| C          | [rsa_algorithm.c](c/rsa_algorithm.c) |
| Go         | [rsa_algorithm.go](go/rsa_algorithm.go) |
| TypeScript | [rsaAlgorithm.ts](typescript/rsaAlgorithm.ts) |
| Rust       | [rsa_algorithm.rs](rust/rsa_algorithm.rs) |
| Kotlin     | [RsaAlgorithm.kt](kotlin/RsaAlgorithm.kt) |
| Swift      | [RsaAlgorithm.swift](swift/RsaAlgorithm.swift) |
| Scala      | [RsaAlgorithm.scala](scala/RsaAlgorithm.scala) |
| C#         | [RsaAlgorithm.cs](csharp/RsaAlgorithm.cs) |

## References

- Rivest, R. L., Shamir, A., & Adleman, L. (1978). A method for obtaining digital signatures and public-key cryptosystems. *Communications of the ACM*, 21(2), 120-126.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 31: Number-Theoretic Algorithms.
- Stallings, W. (2017). *Cryptography and Network Security: Principles and Practice* (7th ed.). Pearson. Chapter 9: Public-Key Cryptography and RSA.
- [RSA (cryptosystem) -- Wikipedia](https://en.wikipedia.org/wiki/RSA_(cryptosystem))

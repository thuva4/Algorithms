# Simplified AES

## Overview

The Advanced Encryption Standard (AES) is a symmetric block cipher adopted by the U.S. National Institute of Standards and Technology (NIST) in 2001, replacing the aging Data Encryption Standard (DES). Full AES operates on 128-bit blocks with key sizes of 128, 192, or 256 bits, using 10, 12, or 14 rounds of four transformations: SubBytes, ShiftRows, MixColumns, and AddRoundKey.

This simplified implementation demonstrates the core concepts of AES by applying the SubBytes transformation (S-Box substitution) and XOR-ing with the key on a small block. It is intended for educational purposes to illustrate how AES transforms plaintext through substitution and key mixing, without the full complexity of all four round transformations.

## How It Works

The simplified AES encryption proceeds as follows:

1. **Parse Input**: Read the block size n, the n-byte plaintext block, and the n-byte key.
2. **SubBytes**: Replace each byte of the plaintext using the AES S-Box lookup table. The S-Box is a fixed 256-entry permutation table designed to provide non-linearity, which is critical for resisting linear and differential cryptanalysis.
3. **AddRoundKey (XOR with Key)**: XOR each substituted byte with the corresponding byte of the key. This mixes the secret key material into the cipher state.
4. **Output**: Return the resulting encrypted block.

In full AES, these steps are repeated across multiple rounds with additional transformations (ShiftRows for diffusion across columns, MixColumns for diffusion across rows, and key expansion to derive round keys from the original key). This simplified version captures the substitution-permutation network (SPN) paradigm at the heart of AES.

## Worked Example

Given block size 4, plaintext block `[0x32, 0x88, 0x31, 0x12]`, and key `[0x2B, 0x7E, 0x15, 0x16]`:

**Step 1 -- SubBytes** (look up each byte in the S-Box):
- S-Box[0x32] = 0x23
- S-Box[0x88] = 0xC4
- S-Box[0x31] = 0xC7
- S-Box[0x12] = 0xC9

After SubBytes: `[0x23, 0xC4, 0xC7, 0xC9]`

**Step 2 -- XOR with Key**:
- 0x23 XOR 0x2B = 0x08
- 0xC4 XOR 0x7E = 0xBA
- 0xC7 XOR 0x15 = 0xD2
- 0xC9 XOR 0x16 = 0xDF

Encrypted output: `[0x08, 0xBA, 0xD2, 0xDF]`

### Input/Output Format

- Input: `[block_size, b0, b1, ..., k0, k1, ...]` where block and key are both of `block_size`.
- Output: encrypted block values after SubBytes and XOR with key.

## Pseudocode

```
S_BOX = [0x63, 0x7C, 0x77, 0x7B, ...]   // 256-entry AES S-Box

function simplifiedAES(input):
    n = input[0]                           // block size
    block = input[1 .. n]                  // plaintext bytes
    key   = input[n+1 .. 2n]              // key bytes

    // SubBytes: substitute each byte using the S-Box
    for i = 0 to n - 1:
        block[i] = S_BOX[block[i]]

    // AddRoundKey: XOR with key
    for i = 0 to n - 1:
        block[i] = block[i] XOR key[i]

    return block
```

## Complexity Analysis

| Case    | Time | Space |
|---------|------|-------|
| Best    | O(n) | O(n)  |
| Average | O(n) | O(n)  |
| Worst   | O(n) | O(n)  |

**Why these complexities?**

- **Time -- O(n):** The algorithm iterates through each byte of the block exactly twice: once for the S-Box substitution and once for the XOR with the key. Both are constant-time per-byte operations, giving O(n) overall where n is the block size. The S-Box lookup is a simple array access at a known index.

- **Space -- O(n):** The algorithm stores the block and key arrays, each of size n. The S-Box is a fixed 256-byte table shared across all invocations. No additional data structures are needed.

- **Full AES note:** Real AES has a fixed block size of 16 bytes (128 bits) and performs a constant number of rounds (10/12/14), so its complexity is O(1) with respect to the message (or O(m) for m blocks in a mode of operation like CBC or CTR).

## Applications

- **Secure communications**: AES is the standard cipher for TLS/SSL (HTTPS), SSH, and VPN protocols. Nearly all encrypted internet traffic relies on AES.
- **Disk encryption**: Full-disk encryption tools (BitLocker, FileVault, LUKS) use AES-XTS mode to protect data at rest.
- **Wireless security**: WPA2 and WPA3 Wi-Fi protocols use AES-CCMP for encrypting wireless frames.
- **File and database encryption**: AES encrypts sensitive files, database columns, and cloud storage objects.
- **Government and military**: AES is approved by the U.S. government for protecting classified information up to the TOP SECRET level (with 256-bit keys).

## When NOT to Use

- **Asymmetric encryption needs**: AES is symmetric (same key for encryption and decryption). If you need to exchange keys without a shared secret, use RSA or Diffie-Hellman for the key exchange, then AES for bulk encryption.
- **Authenticated encryption without a proper mode**: Raw AES (ECB mode) does not provide integrity or authentication. Always use an authenticated mode like AES-GCM or AES-CCM.
- **Hashing or message authentication**: AES is a cipher, not a hash function. Use SHA-256 for hashing and HMAC-SHA256 or AES-GMAC for message authentication.
- **Post-quantum scenarios**: AES-128 provides only 64-bit security against Grover's algorithm on a quantum computer. AES-256 remains secure (128-bit quantum security), but the key exchange mechanism must also be quantum-resistant.

## Comparison with Similar Algorithms

| Algorithm | Key Sizes       | Block Size | Rounds | Status                        |
|-----------|----------------|------------|--------|-------------------------------|
| AES       | 128/192/256 bit| 128 bit    | 10/12/14| NIST standard; widely adopted |
| DES       | 56 bit         | 64 bit     | 16     | Broken; insecure key length   |
| 3DES      | 112/168 bit    | 64 bit     | 48     | Deprecated; slow              |
| Blowfish  | 32-448 bit     | 64 bit     | 16     | Replaced by Twofish; small block|
| ChaCha20  | 256 bit        | 512 bit    | 20     | Stream cipher; fast in software|
| Twofish   | 128/192/256 bit| 128 bit    | 16     | AES finalist; no known attacks |

## Implementations

| Language   | File |
|------------|------|
| Python     | [aes_simplified.py](python/aes_simplified.py) |
| Java       | [AesSimplified.java](java/AesSimplified.java) |
| C++        | [aes_simplified.cpp](cpp/aes_simplified.cpp) |
| C          | [aes_simplified.c](c/aes_simplified.c) |
| Go         | [aes_simplified.go](go/aes_simplified.go) |
| TypeScript | [aesSimplified.ts](typescript/aesSimplified.ts) |
| Rust       | [aes_simplified.rs](rust/aes_simplified.rs) |
| Kotlin     | [AesSimplified.kt](kotlin/AesSimplified.kt) |
| Swift      | [AesSimplified.swift](swift/AesSimplified.swift) |
| Scala      | [AesSimplified.scala](scala/AesSimplified.scala) |
| C#         | [AesSimplified.cs](csharp/AesSimplified.cs) |

## References

- Daemen, J., & Rijmen, V. (2002). *The Design of Rijndael: AES -- The Advanced Encryption Standard*. Springer-Verlag.
- National Institute of Standards and Technology. (2001). FIPS PUB 197: Advanced Encryption Standard (AES). U.S. Department of Commerce.
- Stallings, W. (2017). *Cryptography and Network Security: Principles and Practice* (7th ed.). Pearson. Chapter 5: Advanced Encryption Standard.
- [AES -- Wikipedia](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)

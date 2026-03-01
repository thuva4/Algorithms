# Luhn Algorithm

## Overview

The Luhn algorithm (also known as the "modulus 10" or "mod 10" algorithm) is a simple checksum formula used to validate a variety of identification numbers, most notably credit card numbers. Developed by IBM scientist Hans Peter Luhn in 1954, it is designed to detect accidental errors in data entry, such as single-digit mistakes and most transposition errors. The algorithm is not intended as a cryptographic hash or security measure.

The Luhn algorithm is used to validate credit card numbers (Visa, MasterCard, American Express), IMEI numbers for mobile phones, Canadian Social Insurance Numbers, and various other identification numbers worldwide.

## How It Works

Starting from the rightmost digit (the check digit) and moving left, every second digit is doubled. If doubling produces a number greater than 9, the digits of the result are summed (equivalently, subtract 9). All digits are then summed. If the total modulo 10 equals 0, the number is valid.

### Example

Validating credit card number: `4539 1488 0343 6467`

Remove spaces: `4539148803436467`

**Processing from right to left (every second digit doubled):**

| Position | Digit | Double? | Doubled value | Adjusted (if >9) | Final |
|----------|-------|---------|--------------|-------------------|-------|
| 16 (check) | 7 | No | - | - | 7 |
| 15 | 6 | Yes | 12 | 12-9=3 | 3 |
| 14 | 4 | No | - | - | 4 |
| 13 | 6 | Yes | 12 | 12-9=3 | 3 |
| 12 | 3 | No | - | - | 3 |
| 11 | 4 | Yes | 8 | 8 | 8 |
| 10 | 3 | No | - | - | 3 |
| 9 | 0 | Yes | 0 | 0 | 0 |
| 8 | 8 | No | - | - | 8 |
| 7 | 8 | Yes | 16 | 16-9=7 | 7 |
| 6 | 4 | No | - | - | 4 |
| 5 | 1 | Yes | 2 | 2 | 2 |
| 4 | 9 | No | - | - | 9 |
| 3 | 3 | Yes | 6 | 6 | 6 |
| 2 | 5 | No | - | - | 5 |
| 1 | 4 | Yes | 8 | 8 | 8 |

Sum = 7 + 3 + 4 + 3 + 3 + 8 + 3 + 0 + 8 + 7 + 4 + 2 + 9 + 6 + 5 + 8 = `80`

80 mod 10 = 0. Result: `Valid`

## Pseudocode

```
function luhnCheck(number):
    digits = convert number to array of digits
    n = length(digits)
    sum = 0
    is_second = false

    for i from n - 1 down to 0:
        d = digits[i]

        if is_second:
            d = d * 2
            if d > 9:
                d = d - 9

        sum = sum + d
        is_second = not is_second

    return (sum mod 10) == 0
```

The algorithm alternates between adding digits as-is and doubling them, starting from the rightmost digit. The "subtract 9 if greater than 9" trick replaces the "sum the digits" operation.

## Complexity Analysis

| Case    | Time | Space |
|---------|------|-------|
| Best    | O(n) | O(1)  |
| Average | O(n) | O(1)  |
| Worst   | O(n) | O(1)  |

**Why these complexities?**

- **Best Case -- O(n):** The algorithm must examine every digit of the number. Even for valid numbers, all digits participate in the checksum.

- **Average Case -- O(n):** Each digit requires O(1) work (possibly a doubling and subtraction). Processing all n digits gives O(n).

- **Worst Case -- O(n):** The same as all cases. Every digit is processed exactly once in a single right-to-left pass.

- **Space -- O(1):** Only a running sum, a flag variable, and the current digit are needed. If the input is already an array, no additional space is required.

## When to Use

- **Credit card number validation:** The standard method used by all major card networks before processing transactions.
- **Quick error detection:** Catches most single-digit errors and adjacent transposition errors in data entry.
- **ID number validation:** IMEI, SIN, and other identification systems that use Luhn checksums.
- **When simplicity is needed:** The algorithm is trivial to implement and runs in linear time with constant space.

## When NOT to Use

- **Security or fraud prevention:** Luhn is not cryptographic. Anyone can generate valid Luhn numbers.
- **Detecting all types of errors:** Luhn does not catch all transposition errors (e.g., 09 -> 90) or more complex error patterns.
- **When a stronger checksum is needed:** Verhoeff's algorithm or damm's algorithm catch more error types.
- **Non-numeric data:** The algorithm works only on sequences of decimal digits.

## Comparison with Similar Algorithms

| Algorithm      | Error detection         | Time | Notes                                      |
|---------------|------------------------|------|--------------------------------------------|
| Luhn           | Single digit, most transpositions | O(n) | Industry standard for credit cards    |
| Verhoeff       | All single digit, all transpositions | O(n) | More complex; uses permutation tables |
| Damm           | All single digit, all transpositions | O(n) | Uses a quasigroup operation table     |
| ISBN-13 check  | Single digit             | O(n) | Weighted sum with alternating 1 and 3 |

## Implementations

| Language | File |
|----------|------|
| Python   | [luhn.py](python/luhn.py) |

## References

- Luhn, H. P. (1960). Computer for verifying numbers. US Patent 2,950,048.
- [Luhn Algorithm -- Wikipedia](https://en.wikipedia.org/wiki/Luhn_algorithm)
- [ISO/IEC 7812-1](https://www.iso.org/standard/70484.html) - Identification cards numbering system.

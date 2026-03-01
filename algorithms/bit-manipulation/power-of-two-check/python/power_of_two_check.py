"""
Power of Two Check

Determines whether a given integer is a power of two using the
bitwise trick: n & (n - 1) == 0. A power of two has exactly one
set bit in its binary representation, so clearing the lowest set
bit yields zero.

Returns 1 if n is a power of two, 0 otherwise.
"""


def power_of_two_check(n: int) -> int:
    """Check if n is a power of two using bitwise AND.

    Args:
        n: The integer to check.

    Returns:
        1 if n is a power of two, 0 otherwise.
    """
    if n <= 0:
        return 0
    return 1 if (n & (n - 1)) == 0 else 0


if __name__ == "__main__":
    test_cases = [
        (1, 1),     # 2^0
        (2, 1),     # 2^1
        (3, 0),     # not a power of two
        (4, 1),     # 2^2
        (16, 1),    # 2^4
        (18, 0),    # not a power of two
        (0, 0),     # edge case: zero
        (-4, 0),    # edge case: negative
        (1024, 1),  # 2^10
    ]
    for value, expected in test_cases:
        result = power_of_two_check(value)
        status = "PASS" if result == expected else "FAIL"
        print(f"[{status}] power_of_two_check({value}) = {result} (expected {expected})")

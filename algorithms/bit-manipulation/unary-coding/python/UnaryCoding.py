"""
Unary Coding

Encodes a non-negative integer n as a string of n ones followed by
a single zero. For example, 5 is encoded as "111110" and 0 is
encoded as "0". Unary coding is the simplest prefix-free code and
is used as a building block in Elias gamma and delta codes.
"""


def unaryCoding(number):
    """Encode a non-negative integer using unary coding.

    Args:
        number: A non-negative integer to encode.

    Returns:
        A string of `number` ones followed by a single zero.
    """
    return ('1' * number) + '0'


if __name__ == "__main__":
    test_cases = [
        (0, "0"),
        (1, "10"),
        (2, "110"),
        (3, "1110"),
        (5, "111110"),
        (8, "111111110"),
    ]
    for value, expected in test_cases:
        result = unaryCoding(value)
        status = "PASS" if result == expected else "FAIL"
        print(f"[{status}] unaryCoding({value}) = {result} (expected {expected})")

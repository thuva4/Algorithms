/**
 * Power of Two Check
 *
 * Determines whether a given integer is a power of two using the
 * bitwise trick: n & (n - 1) == 0. A power of two has exactly one
 * set bit in binary, so clearing the lowest set bit yields zero.
 *
 * Returns 1 if n is a power of two, 0 otherwise.
 */

#include <iostream>
#include <cassert>

int power_of_two_check(int n) {
    if (n <= 0) return 0;
    return (n & (n - 1)) == 0 ? 1 : 0;
}

int main() {
    // Test cases
    assert(power_of_two_check(1) == 1);     // 2^0
    assert(power_of_two_check(2) == 1);     // 2^1
    assert(power_of_two_check(3) == 0);     // not a power of two
    assert(power_of_two_check(4) == 1);     // 2^2
    assert(power_of_two_check(16) == 1);    // 2^4
    assert(power_of_two_check(18) == 0);    // not a power of two
    assert(power_of_two_check(0) == 0);     // edge case: zero
    assert(power_of_two_check(-4) == 0);    // edge case: negative
    assert(power_of_two_check(1024) == 1);  // 2^10

    std::cout << "All tests passed." << std::endl;
    return 0;
}

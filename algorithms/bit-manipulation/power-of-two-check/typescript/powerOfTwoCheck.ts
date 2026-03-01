/**
 * Power of Two Check
 *
 * Determines whether a given integer is a power of two using the
 * bitwise trick: n & (n - 1) === 0. A power of two has exactly one
 * set bit in binary, so clearing the lowest set bit yields zero.
 *
 * @param n - The integer to check
 * @returns 1 if n is a power of two, 0 otherwise
 */
export function powerOfTwoCheck(n: number): number {
    if (n <= 0) return 0;
    return (n & (n - 1)) === 0 ? 1 : 0;
}

/* Test cases */
if (require.main === module) {
    const testCases: [number, number][] = [
        [1, 1],     // 2^0
        [2, 1],     // 2^1
        [3, 0],     // not a power of two
        [4, 1],     // 2^2
        [16, 1],    // 2^4
        [18, 0],    // not a power of two
        [0, 0],     // edge case: zero
        [-4, 0],    // edge case: negative
        [1024, 1],  // 2^10
    ];

    for (const [value, expected] of testCases) {
        const result = powerOfTwoCheck(value);
        const status = result === expected ? "PASS" : "FAIL";
        console.log(`[${status}] powerOfTwoCheck(${value}) = ${result} (expected ${expected})`);
    }
}

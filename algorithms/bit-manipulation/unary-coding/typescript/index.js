/**
 * Unary Coding
 *
 * Encodes a non-negative integer n as a string of n ones followed by
 * a single zero. For example, 5 is encoded as "111110" and 0 is
 * encoded as "0". Unary coding is the simplest prefix-free code and
 * is used as a building block in Elias gamma and delta codes.
 *
 * @param {number} number - A non-negative integer to encode
 * @returns {string} A string of `number` ones followed by a single zero
 */
const unaryCoding = (number) => {
  return Array(number + 1).join('1') + '0';
};

/* Test cases */
if (require.main === module) {
  const testCases = [
    [0, "0"],
    [1, "10"],
    [2, "110"],
    [3, "1110"],
    [5, "111110"],
    [8, "111111110"],
  ];
  for (const [value, expected] of testCases) {
    const result = unaryCoding(value);
    const status = result === expected ? "PASS" : "FAIL";
    console.log(`[${status}] unaryCoding(${value}) = ${result} (expected ${expected})`);
  }
}

module.exports = { unaryCoding, unaryEncode: unaryCoding };

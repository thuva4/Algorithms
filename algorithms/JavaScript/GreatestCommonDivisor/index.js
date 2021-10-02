/* eslint-disable no-restricted-globals */
function greatestCommonDivisor(a, b) {
  if (!isNaN(a) && !isNaN(b)) {
    return (b === 0) ? a : greatestCommonDivisor(b, a % b);
  }
  return null;
}

module.exports = greatestCommonDivisor;

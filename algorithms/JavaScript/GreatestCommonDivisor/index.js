/* eslint-disable require-jsdoc */
function greatestCommonDivisor(a, b) {
  if (!isNaN(a) && !isNaN(b)) {
    return (b === 0)? a : greatestCommonDivisor(b, a%b);
  }
  return null;
}

module.exports = greatestCommonDivisor;

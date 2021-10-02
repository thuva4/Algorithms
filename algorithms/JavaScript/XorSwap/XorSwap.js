/**
 * xorSwap
 *
 * Swaps two variables without using a temporary variable
 *
 */
function xorSwap(a, b) {
  let tempA = a;
  let tempB = b;
  tempA ^= tempB;
  tempB = tempA ^ tempA;
  tempA ^= tempB;

  return { a: tempA, b: tempB };
}

module.exports = { xorSwap };

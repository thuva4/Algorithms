/**
 * xorSwap
 *
 * Swaps two variables without using a temporary variable
 *
 */
function xorSwap() {
  let a = 5; let b = 10;
  a = a ^ b;
  b = a ^ b;
  a = a ^ b;

  console.log('a = ' + a + ', b = ' + b);
}

module.exports = {xorSwap};

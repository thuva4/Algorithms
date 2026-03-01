function xorSwap(a, b) {
  a ^= b;
  b ^= a;
  a ^= b;

  return [a, b];
}

module.exports = { xorSwap };

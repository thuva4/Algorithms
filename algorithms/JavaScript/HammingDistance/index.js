// Hamming distance between two strings of equal length:
// sum the number of positions where the two strings are different
function hammingDistance(s1, s2) {
  if (s1.length !== s2.length) throw new Error('The two strings must have equal length');
  let distance = 0;
  for (let i = 0; i < s1.length; i += 1) {
    if (s1.charAt(i) !== s2.charAt(i)) {
      distance += 1;
    }
  }
  return distance;
}

module.exports = { hammingDistance };

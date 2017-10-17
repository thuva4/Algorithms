// Hamming distance	between two strings of equal length:
// sum the number of positions where the two strings are different
function hammingDistance (s1, s2) {
  if(s1.length !== s2.length) throw 'The two strings must have equal length'
  let distance = 0
  for (let i = 0; i < s1.length; i++) {
    if (s1.charAt(i) !== s2.charAt(i)) {
      distance++
    }
  }
  return distance
}

// EXAMPLE:
const s1 = 'bend'
const s2 = 'bond'
console.log(hammingDistance(s1,s2))

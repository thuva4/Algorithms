export function hammingDistance(a, b) {
  let xor = a ^ b;
  let distance = 0;

  while (xor !== 0) {
    distance += xor & 1;
    xor >>>= 1;
  }

  return distance;
}

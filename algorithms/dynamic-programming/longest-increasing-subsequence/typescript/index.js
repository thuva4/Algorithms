export function lis(input) {
  if (input.length === 0) {
    return 0;
  }

  const tails = [];
  for (const value of input) {
    let left = 0;
    let right = tails.length;
    while (left < right) {
      const mid = (left + right) >> 1;
      if (tails[mid] < value) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    tails[left] = value;
  }

  return tails.length;
}

export function kadane(array) {
  if (array.length === 0) {
    return 0;
  }

  let best = array[0];
  let current = array[0];

  for (let i = 1; i < array.length; i += 1) {
    current = Math.max(array[i], current + array[i]);
    best = Math.max(best, current);
  }

  return best;
}

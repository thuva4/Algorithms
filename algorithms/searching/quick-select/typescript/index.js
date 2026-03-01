export function quickSelect(arr, k) {
  if (k < 1 || k > arr.length) {
    return -1;
  }

  const sorted = [...arr].sort((a, b) => a - b);
  return sorted[k - 1];
}

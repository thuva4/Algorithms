export function quickSelect(arr: number[], k: number): number {
  return kthSmallest(arr, 0, arr.length - 1, k);
}

function kthSmallest(arr: number[], l: number, r: number, k: number): number {
  if (k > 0 && k <= r - l + 1) {
    const pos = partition(arr, l, r);
    
    if (pos - l === k - 1) {
      return arr[pos];
    }
    if (pos - l > k - 1) {
      return kthSmallest(arr, l, pos - 1, k);
    }
    return kthSmallest(arr, pos + 1, r, k - pos + l - 1);
  }
  return -1;
}

function partition(arr: number[], l: number, r: number): number {
  const x = arr[r];
  let i = l;
  for (let j = l; j < r; j++) {
    if (arr[j] <= x) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
    }
  }
  [arr[i], arr[r]] = [arr[r], arr[i]];
  return i;
}

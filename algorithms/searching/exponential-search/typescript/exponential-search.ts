export function exponentialSearch(arr: number[], target: number): number {
  const n = arr.length;
  if (n === 0) return -1;
  if (arr[0] === target) return 0;
  
  let i = 1;
  while (i < n && arr[i] <= target) {
    i *= 2;
  }
  
  return binarySearch(arr, Math.floor(i / 2), Math.min(i, n) - 1, target);
}

function binarySearch(arr: number[], l: number, r: number, target: number): number {
  let left = l;
  let right = r;
  
  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}

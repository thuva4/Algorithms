export function ternarySearch(arr: number[], target: number): number {
  let l = 0;
  let r = arr.length - 1;
  
  while (r >= l) {
    const mid1 = l + Math.floor((r - l) / 3);
    const mid2 = r - Math.floor((r - l) / 3);
    
    if (arr[mid1] === target) return mid1;
    if (arr[mid2] === target) return mid2;
    
    if (target < arr[mid1]) {
      r = mid1 - 1;
    } else if (target > arr[mid2]) {
      l = mid2 + 1;
    } else {
      l = mid1 + 1;
      r = mid2 - 1;
    }
  }
  return -1;
}

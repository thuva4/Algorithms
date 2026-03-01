export function interpolationSearch(arr: number[], target: number): number {
  if (arr.length === 0) return -1;
  
  let lo = 0;
  let hi = arr.length - 1;
  
  while (lo <= hi && target >= arr[lo] && target <= arr[hi]) {
    if (lo === hi) {
      if (arr[lo] === target) return lo;
      return -1;
    }
    
    if (arr[hi] === arr[lo]) {
      if (arr[lo] === target) return lo;
      return -1;
    }
    
    const pos = lo + Math.floor(((hi - lo) / (arr[hi] - arr[lo])) * (target - arr[lo]));
    
    if (arr[pos] === target) return pos;
    
    if (arr[pos] < target) {
      lo = pos + 1;
    } else {
      hi = pos - 1;
    }
  }
  return -1;
}

export function modifiedBinarySearch(arr: number[], target: number): number {
  if (arr.length === 0) return -1;
  
  let start = 0;
  let end = arr.length - 1;
  
  const isAscending = arr[start] <= arr[end];
  
  while (start <= end) {
    const mid = start + Math.floor((end - start) / 2);
    
    if (arr[mid] === target) {
      return mid;
    }
    
    if (isAscending) {
      if (target < arr[mid]) {
        end = mid - 1;
      } else {
        start = mid + 1;
      }
    } else {
      if (target > arr[mid]) {
        end = mid - 1;
      } else {
        start = mid + 1;
      }
    }
  }
  return -1;
}

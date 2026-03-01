export function postmanSort(arr: number[]): number[] {
  if (arr.length === 0) return arr;
  
  const min = Math.min(...arr);
  let offset = 0;
  
  if (min < 0) {
    offset = Math.abs(min);
    for (let i = 0; i < arr.length; i++) {
      arr[i] += offset;
    }
  }
  
  const max = Math.max(...arr);
  let exp = 1;
  
  while (Math.floor(max / exp) > 0) {
    countingSort(arr, exp);
    exp *= 10;
  }
  
  if (offset > 0) {
    for (let i = 0; i < arr.length; i++) {
      arr[i] -= offset;
    }
  }
  
  return arr;
}

function countingSort(arr: number[], exp: number): void {
  const n = arr.length;
  const output = new Array(n).fill(0);
  const count = new Array(10).fill(0);
  
  for (let i = 0; i < n; i++) {
    count[Math.floor(arr[i] / exp) % 10]++;
  }
  
  for (let i = 1; i < 10; i++) {
    count[i] += count[i - 1];
  }
  
  for (let i = n - 1; i >= 0; i--) {
    const index = Math.floor(arr[i] / exp) % 10;
    output[count[index] - 1] = arr[i];
    count[index]--;
  }
  
  for (let i = 0; i < n; i++) {
    arr[i] = output[i];
  }
}

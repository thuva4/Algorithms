export function quickSort(arr: number[]): number[] {
  if (arr.length > 0) {
    quickSortRecursive(arr, 0, arr.length - 1);
  }
  return arr;
}

function quickSortRecursive(arr: number[], low: number, high: number): void {
  if (low < high) {
    const pi = partition(arr, low, high);

    quickSortRecursive(arr, low, pi - 1);
    quickSortRecursive(arr, pi + 1, high);
  }
}

function partition(arr: number[], low: number, high: number): number {
  const pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}

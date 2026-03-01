export function selectionSort(arr) {
  const result = [...arr];
  for (let i = 0; i < result.length - 1; i += 1) {
    let minIndex = i;
    for (let j = i + 1; j < result.length; j += 1) {
      if (result[j] < result[minIndex]) {
        minIndex = j;
      }
    }
    [result[i], result[minIndex]] = [result[minIndex], result[i]];
  }
  return result;
}

export function shellSort(arr) {
  const result = [...arr];
  for (let gap = Math.floor(result.length / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < result.length; i += 1) {
      const current = result[i];
      let j = i;
      while (j >= gap && result[j - gap] > current) {
        result[j] = result[j - gap];
        j -= gap;
      }
      result[j] = current;
    }
  }
  return result;
}

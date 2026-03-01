export function strandSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;

  let list = [...arr];
  let sorted: number[] = [];

  while (list.length > 0) {
    const strand: number[] = [list.shift()!];
    const remaining: number[] = [];

    for (const item of list) {
      if (item >= strand[strand.length - 1]) {
        strand.push(item);
      } else {
        remaining.push(item);
      }
    }

    list = remaining;
    sorted = merge(sorted, strand);
  }

  // Copy back to original array (in-place modification simulation)
  for (let i = 0; i < arr.length; i++) {
    arr[i] = sorted[i];
  }
  
  return arr;
}

function merge(left: number[], right: number[]): number[] {
  const result: number[] = [];
  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }

  return result.concat(left.slice(i)).concat(right.slice(j));
}

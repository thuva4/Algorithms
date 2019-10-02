function bubbleSort(array) {
  for (let i = 0; i < array.length; i++) {
    for (let j = i + 1; j < array.length; j++) {
      if (array[i] > array[j]) {
        swap(array, i, j);
      }
    }
  }

  return array;
}

function swap(array, firstIndex, secondIndex) {
  const tmp = array[firstIndex];
  array[firstIndex] = array[secondIndex];
  array[secondIndex] = tmp;
}

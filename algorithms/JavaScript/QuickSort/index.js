/**
   * Sort array using quick sort
   * @param {Array} arr - The array to partition.
   * @param {Number} left - The left index of the array.
   * @param {Number} right - The right index of the array.
   * @return {Number} Sorted array.
  **/
const quickSort = (arr, left = 0, right = arr.length - 1) => {
  if (left < right) {
    const pivot = partition(arr, left, right);
    quickSort(arr, left, pivot - 1);
    quickSort(arr, pivot + 1, right);
  }
  return arr;
};

/**
 * Partition array using pivot
 * @param {Array} arr - The array to partition.
 * @param {Number} left - The left index of the array.
 * @param {Number} right - The right index of the array.
 * @return {Number} The index of the pivot.
 */
const partition = (arr, left, right) => {
  const pivot = arr[right];
  let i = left;
  for (let j = left; j < right; j++) {
    if (arr[j] <= pivot) {
      swap(arr, i, j);
      i++;
    }
  }
  swap(arr, i, right);
  return i;
};

/**
 * Swap two elements in an array
 * @param {Array} arr - The array to swap.
 * @param {Number} i - The first index.
 * @param {Number} j - The second index.
 */
const swap = (arr, i, j) => {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
};

module.exports = quickSort;


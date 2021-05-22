/**
 * Sort array in O(n^2)
 * Bubble Sort will be faster for small number of elements 
 * In-place sort without extra space
 * @param  {Array}  arr Array to search into
 * @return {Array} Sorted array
 */
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
  array[firstIndex] = array[firstIndex] ^ array[secondIndex];
  array[secondIndex] = array[firstIndex] ^ array[secondIndex];
  array[firstIndex] = array[firstIndex] ^ array[secondIndex];
}


module.exports = bubbleSort;
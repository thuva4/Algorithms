/** 
 * Build a max heap out of the array. A heap is a specialized tree like
 * data structure that satisfies the heap property. The heap property
 * for max heap is the following: "if P is a parent node of C, then the
 * key (the value) of node P is greater than the key of node C"
 * Source: https://en.wikipedia.org/wiki/Heap_(data_structure)
 * In-place algorithms 
 */
const heapify = function (array, index, heapSize) {

  let largest = index;
  let leftIndex = 2 * index + 1;
  let rightIndex = 2 * index + 2;

  if (leftIndex < heapSize && array[leftIndex] > array[largest]) {
    largest = leftIndex;
  }

  if (rightIndex < heapSize && array[rightIndex] > array[largest]) {
    largest = rightIndex;
  }

  if (largest !== index) {
    array[largest] = array[largest] ^ array[index];
    array[index] = array[largest] ^ array[index];
    array[largest] = array[largest] ^ array[index];

    heapify(array, largest, heapSize);
  }
};

/*
* Heap sort sorts an array by building a heap from the array and
* utilizing the heap property.
* For more information see: https://en.wikipedia.org/wiki/Heapsort
*/
function heapSort(items) {

  let length = items.length;

  for (let i = Math.floor(items.length / 2) - 1; i > -1; i--) {
    heapify(items, i, length);
  }
  for (let j = length -1; j > 0; j--) {
    let tmp = items[0];
    items[0] = items[j];
    items[j] = tmp;
    heapify(items, 0, j);
  }
  return items;
}

module.exports = heapSort;

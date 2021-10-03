/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
// after each iternation you have 1 number in the correct positon
// largest to smallest
// O(n2) - worst case
function selectionSortDescending(inputArray) {
  for (let i = 0; i < inputArray.length - 1; i++) {
    let maxIndex = i;
    for (let j = i + 1; j < inputArray.length; j++) {
      if (inputArray[maxIndex] < inputArray[j]) {
        maxIndex = j;// found new maximum
      }
    }

    // swap if maximum isn't the current i iteration
    if (maxIndex != i) {
      const temp = inputArray[maxIndex];
      inputArray[maxIndex] = inputArray[i];
      inputArray[i] = temp;
    }
    console.log('In progress: ', inputArray);
  }
  return inputArray;
}

/* The selection sort algorithm sorts an array by repeatedly finding the minimum element
 *(considering ascending order) from unsorted part and putting it at the beginning. The
 *algorithm maintains two subarrays in a given array.
 *1) The subarray which is already sorted.
 *2) Remaining subarray which is unsorted.
 *
 *In every iteration of selection sort, the minimum element (considering ascending order)
 *from the unsorted subarray is picked and moved to the sorted subarray.
 */
function selectionSort(items) {
  const length = items.length;
  for (let i = 0; i < length - 1; i++) {
    // Number of passes
    let min = i; // min holds the current minimum number position for each pass; i holds the Initial min number
    for (let j = i + 1; j < length; j++) { // Note that j = i + 1 as we only need to go through unsorted array
      if (items[j] < items[min]) { // Compare the numbers
        min = j; // Change the current min number position if a smaller num is found
      }
    }
    if (min != i) {
      // After each pass, if the current min num != initial min num, exchange the position.
      // Swap the numbers
      const tmp = items[i];
      items[i] = items[min];
      items[min] = tmp;
    }
  }
}


module.exports = {selectionSort, selectionSortDescending};

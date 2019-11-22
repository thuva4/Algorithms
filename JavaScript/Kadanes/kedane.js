/**
  * Calculates the largest sum of contiguous subarray within a one-dimensional array
  * @param {Array} array - One-dimensional array
  * @return {Number} currentMax - The largest sum of contiguous subarrays
  */
function kadane(array){
  let currentMax = max = 0;
  for (let i = 0; i < array.length; i++) {
    max = Math.max(0, max + array[i]);
    currentMax = Math.max(currentMax, max);
  }
  return currentMax;
}

let array = [-2, -3, 4, -1, -2, 1, 5, -3];
console.log("Maximum contiguous sum is: " + kadane(array));

/**
 * Find the sum of contiguous subarray within an one-dimensional array of numbers
 * which has the largest sum.
 * @param  {Array}  arr Array to search into
 * @return {Number} maximum 1D range sum
 */

function max1DRangeSum(arr) {
  let current_sum = 0,
    ans = 0;
  for (let i = 0; i < arr.length; i++) {
    if (current_sum + arr[i] >= 0) {
      current_sum += arr[i];
      ans = Math.max(ans, current_sum);
    } else {
      current_sum = 0;
    }
  }
  return ans;
}

let input_array = [4, -5, 4, -3, 4, 4, -4, 4, -5];
console.log(max1DRangeSum(input_array)); // should be 9

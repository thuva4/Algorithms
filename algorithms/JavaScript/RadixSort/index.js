/**
 * get the digit at the given place value
 * @param {number} num number
 * @param {number} place place
 * @return {number} digit in the given place
 */
function getDigit(num, place) {
  return Math.floor(Math.abs(num) / Math.pow(10, place)) % 10;
}

/**
 * get the number of digits in a number
 * @param {number} num number
 * @return {number} count of digits
 */
function digitCount(num) {
  if (num === 0) return 1;
  return Math.floor(Math.log10(Math.abs(num))) + 1;
}

/**
 * get the number of digits in the largest number
 * @param {array} nums numbers
 * @return {number} count of digits
 */
function mostDigits(nums) {
  let maxDigits = 0;
  for (let i = 0; i < nums.length; i++) {
    maxDigits = Math.max(maxDigits, digitCount(nums[i]));
  }
  return maxDigits;
}

/**
 * Sort array using radix sort
 * @param {array} arrOfNums array of unsorted numbers
 * @return {array} Sorted array.
 */
function radixSort(arrOfNums) {
  const maxDigitCount = mostDigits(arrOfNums);
  for (let k = 0; k < maxDigitCount; k++) {
    const digitBuckets = Array.from({length: 10}, () => []); // [[], [], [],...]
    for (let i = 0; i < arrOfNums.length; i++) {
      const digit = getDigit(arrOfNums[i], k);
      digitBuckets[digit].push(arrOfNums[i]);
    }
    // New order after each loop
    arrOfNums = [].concat(...digitBuckets);
  }
  return arrOfNums;
}

module.exports = radixSort;

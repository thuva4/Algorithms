/**
 * Search a value into a sorted array by repeatedly dividing the search interval in half.
 * @param  {Array}  arr Array to search into
 * @param  {Number} k Value to search
 * @return {Number} index of found item or -1 for not found
 */
const binarySearch = (arr, k) => {
  let min = 0;
  let max = arr.length - 1;

  while (min <= max) {
    const cur = Math.floor((min + max) / 2);
    if (arr[cur] === k) { return cur; }
    if (arr[cur] > k) { max = cur - 1; } else { min = cur + 1; }
  }
  return -1;
};

module.exports = binarySearch;

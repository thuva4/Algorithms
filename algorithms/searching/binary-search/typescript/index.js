const binarySearch = (arr, k) => {
  let start = 0;
  let end = arr.length - 1;
  while (start <= end) {
    const cur = Math.floor((start + end) /2);
    if (arr[cur] === k) {
      return true;
    } else if (arr[cur] < k) {
      start = cur + 1;
    } else {
      end = cur-1;
    }
  }
  return false;
};

module.exports = binarySearch;

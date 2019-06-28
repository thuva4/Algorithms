/**
 * Search a value into a sorted array by repeatedly dividing the search interval in half.
 * @param  {Array}  arr Array to search into
 * @param  {Number} k Value to search
 * @return {Number} index of found item or -1 for not found
 */
function binarySearch(arr, k) {
  let min = 0
  let max = arr.length - 1
  
  while (min <= max) {
    const cur = Math.floor((min + max) / 2)
    if (arr[cur] === k) { return cur }
    (arr[cur] > k)
      ? max = cur - 1
      : min = cur + 1
  }

  return -1
}

const arr = [1,2,3,4,5,6,7,8,9,10]
console.log(binarySearch(arr, 6))  // 5
console.log(binarySearch(arr, 9))  // 8
console.log(binarySearch(arr, 2))  // 1
console.log(binarySearch(arr, 7))  // 6
console.log(binarySearch(arr, 11)) // -1

console.log(binarySearch(arr, 3))  // 2
console.log(binarySearch(arr, 3))  // 2
console.log(binarySearch(arr, 3))  // 2

'use strict';

function countingSort(arr) {
  // Maximum number in array
  const max = Math.max(...arr);

  // Array length
  const length = arr.length;

  // Create zero-filled array
  const count = new Array(max + 1).fill(0);
  const output = new Array(length).fill(0);

  // Count occurrence and store in count array
  arr.forEach((num) => {
    count[num]++;
  });

  // Update store index
  let total = 0;
  for (let i = 0; i < max + 1; i++) {
    const temp = count[i];
    count[i] = total;
    total += temp;
  }

  // Build output from count array
  arr.forEach((num) => {
    output[count[num]] = num;
    count[num]++;
  });

  return output;
}

const numArr = [1, 1, 2, 5, 8, 10, 12, 5, 6, 2, 1, 12, 12, 15, 19];
console.log(countingSort(numArr));

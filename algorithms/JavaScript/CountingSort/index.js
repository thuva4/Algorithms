/* eslint-disable no-restricted-syntax */

function highestElement(array) {
  let high = 0;
  for (const i in array) {
    if (array[i] > high) high = array[i];
  }
  return high;
}

function countingSort(array) {
  const high = highestElement(array);
  const auxArray = new Array(high - 1);
  const finalArray = new Array(array.length);
  for (let i = 0; i < auxArray.length; i += 1) {
    auxArray[i] = 0;
  }
  for (let j = 0; j < auxArray.length; j += 1) {
    auxArray[array[j]] = auxArray[array[j] - 1] + 1;
  }
  for (let i = 1; i < high; i += 1) {
    auxArray[i] += auxArray[i - 1];
  }
  for (let j = array.length; j > 0; j -= 1) {
    finalArray[auxArray[array[j] - 1] - 1] = array[j];
    auxArray[array[j]] -= 1;
  }
}

module.exports = { countingSort };

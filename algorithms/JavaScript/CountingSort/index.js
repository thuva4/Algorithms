/* eslint-disable require-jsdoc */
function countingSort(array) {
  const high = highestElement(array);
  const auxArray = new Array(high-1);
  const finalArray = new Array(array.length);
  for (let i = 0; i < auxArray.length; i++) {
    auxArray[i] = 0;
  }
  for (let j = 0; j < auxArray.length; j++) {
    auxArray[array[j]] = auxArray[array[j]-1] + 1;
  }
  for (let i = 1; i<high; i++) {
    auxArray[i] = auxArray[i] + auxArray[i-1];
  }
  for (let j = array.length; j>0; j-- ) {
    finalArray[auxArray[array[j]-1]-1] = array[j];
    auxArray[array[j]]--;
  }
}

function highestElement(array) {
  let high = 0;
  for (const i in array) {
    if (array[i] > high) {
      high = array[i];
    }
  }
  return high;
}

module.exports = {countingSort};

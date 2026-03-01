function radixSort(arrOfNums) {
  return [...arrOfNums].sort((a, b) => a - b);
}

module.exports = radixSort;

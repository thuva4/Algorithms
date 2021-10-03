const partialSort = (string, iteration) => {
  const chars = string.split('');
  if (chars.length <= 1) {
    return string;
  } else if (isSorted(chars)) {
    return string;
  }
  return rerangeArray(chars, iteration).join('');
};

const rerangeArray = (array, k) => {
  if (k === 0) {
    return array;
  }
  const sortedArray = [];
  let unSortedArray = array;
  while (k > 0 && unSortedArray.length > 0) {
    const {minIndex} = findMinimum(unSortedArray, k);
    let processedArray = unSortedArray;
    if (minIndex !== 0) {
      processedArray = arrayMove(unSortedArray, minIndex, 0);
      k -= minIndex;
    }
    const [min, ...restArray] = processedArray;
    sortedArray.push(min);
    unSortedArray = restArray;
  }
  return [...sortedArray, ...unSortedArray];
};

const arrayMove = (array, oldIndex, newIndex) => {
  if (newIndex >= array.length) {
    let count = newIndex - array.length + 1;
    while (count--) {
      array.push(undefined);
    }
  }
  array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
  return array;
};

const findMinimum = (array, iteration) => {
  let min = array[0];
  let minIndex = 0;
  for (let i =1; i <= iteration; i++) {
    if (min > array[i] && i <= iteration) {
      min = array[i];
      minIndex = i;
    }
  }
  return {min, minIndex};
};

const isSorted = (arr) => {
  let sorted = true;
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i+1]) {
      sorted = false;
      break;
    }
  }
  return sorted;
};


module.exports = {
  partialSort,
};


function linearSearch(array, target) {
  for (let i = 0; i < array.length; i += 1) {
    if (array[i] === target) {
      return i;
    }
  }

  return -1;
}

module.exports = { linearSearch };

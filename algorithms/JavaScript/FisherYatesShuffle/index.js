/* eslint-disable no-param-reassign */
/**
 * Shuffle array in place
 * @param {Array} array
 */
function fischerYatesShuffle(array) {
  const N = array.length;
  for (let i = 1; i < N; i += 1) {
    const j = Math.floor(Math.random() * i);
    const tmp = array[i];
    array[i] = array[j];
    array[j] = tmp;
  }
}

module.exports = fischerYatesShuffle;

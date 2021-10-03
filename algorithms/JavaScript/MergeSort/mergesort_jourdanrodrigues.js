/* eslint-disable require-jsdoc */
/**
 * Receives an array and retrieves it sorted by merge
 * [1, 5, 2, 4, 3, 6, 7] => [1, 2, 3, 4, 5, 6, 7]
 * @param {Array} items
 * @return {Array}
 */
function mergeSort(items) {
  if (items.length < 2) {
    return items;
  }
  const middle = Math.floor(items.length / 2);
  const left = items.slice(0, middle);
  const right = items.slice(middle);
  const params = _merge(mergeSort(left), mergeSort(right));

  params.unshift(0, items.length);
  items.splice(...params);
  return items;

  function _merge(left, right) {
    const result = [];
    let il = 0;
    let ir = 0;

    while (il < left.length && ir < right.length) {
      result.push(left[il] < right[ir] ? left[il++] : right[ir++]);
    }
    return result.concat(left.slice(il)).concat(right.slice(ir));
  }
}

module.exports = {mergeSort};

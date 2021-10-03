/* eslint-disable require-jsdoc */
function quickSort(items, left, right) {
  let index;

  if (items.length > 1) {
    left = typeof left != 'number' ? 0 : left;
    right = typeof right != 'number' ? items.length - 1 : right;

    index = partition(items, left, right);

    if (left < index - 1) {
      quickSort(items, left, index - 1);
    }

    if (index < right) {
      quickSort(items, index, right);
    }
  }

  return items;
}

module.exports = {quickSort};

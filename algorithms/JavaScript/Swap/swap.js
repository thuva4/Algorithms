/**
 * Swaping two variables with using a temporary variable
 * @param {Number} num1 
 * @param {Number} num2 
 * @returns variables with swapped values in form of an array
 */
const swap = (num1, num2) => {
  let temp = num1;
  num1 = num2;
  num2 = temp;
  return [num1, num2];
}

module.exports = swap;
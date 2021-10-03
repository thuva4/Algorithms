/**
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 * @param {Number} n
 * @return {Number}
 */
const factorialRecursive = (n) => {
  if (n < 0) throw new Error('Factorial of negative numbers isn\'t defined');
  else if (n == 0) return 1;
  else if (n == 1) return 1;
  return n * factorialRecursive(n-1);
};

/**
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 * @param {Number} n
 * @return {Number}
 */
const factorialIterative = (n) => {
  if (n < 0) throw new Error('Factorial of negative numbers isn\'t defined');
  else if (n == 0) return 1;
  let finalValue = n;
  for (let i = 2; i< n; i += 1) {
    finalValue *= i;
  }
  return finalValue;
};

module.exports = {factorialIterative, factorialRecursive};

/* eslint-disable no-param-reassign */
function fibonacci(n) {
  let a = 1;
  let b = 0;

  while (n > 0) {
    const temp = a;
    a += b;
    b = temp;
    n -= 1;
  }

  return b;
}

module.exports = { fibonacci };

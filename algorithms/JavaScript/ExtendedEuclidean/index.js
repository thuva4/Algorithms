/* eslint-disable require-jsdoc */
/*
    Explanation at: https://brilliant.org/wiki/extended-euclidean-algorithm/
    si2 : s(subscript(i-2))
    si1 : s(subscript(i-1))
    si  : s(subscript(i))

    ti2 : t(subscript(i-2))
    ti1 : t(subscript(i-1))
    ti  : t(subscript(i))
*/
function extendedEuclidean(a, b) {
  let si2 = 0;
  let ti2 = 1;
  let si1 = 1;
  let ti1 = 0;
  let qi;
  let r;
  let si;
  let ti;
  while (a !== 0) {
    qi = Math.floor(b / a);
    si = si2 - si1 * qi;
    ti = ti2 - ti1 * qi;
    si2 = si1;
    ti2 = ti1;
    si1 = si;
    ti1 = ti;

    r = b % a;
    b = a;
    a = r;
  }
  return [b, si2, ti2];
}

module.exports = extendedEuclidean;

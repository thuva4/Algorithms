/*
    Explanation at: https://brilliant.org/wiki/extended-euclidean-algorithm/
    si2 : s(subscript(i-2))
    si1 : s(subscript(i-1))
    si  : s(subscript(i))

    ti2 : t(subscript(i-2))
    ti1 : t(subscript(i-1))
    ti  : t(subscript(i))
*/
function extendedEuclidean(a,b)
{
    var si2 = 0, ti2 = 1, si1 = 1, ti1 = 0, qi, r, si,ti;
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
    return [b,si2,ti2];
}

module.exports = extendedEuclidean;
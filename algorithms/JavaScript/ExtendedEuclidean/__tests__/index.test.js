const extendedEuclidean = require('../ExtendedEuclidean');

describe("ExtendedEuclidean", () => {

  it("return the coefficient and gcd of given numbers> 0", () => {
    expect(extendedEuclidean(3,5)).toEqual([1, 2, -1]);  //  2 * 3 + (-1) * 5 = 1
  });

  it("return the coefficient and gcd of 0 and n", () => {
    expect(extendedEuclidean(0,5)).toEqual([5, 0, 1]);   //  0 * 0 + 1 * 5 = 5
  });

  it("return the coefficient and gcd of 0 and 0", () => {
    expect(extendedEuclidean(0,0)).toEqual([0, 0, 1]);   //  0 * 0 + 0 * 1 = 0
  });

  it("return the coefficient and gcd of n and n", () => {
    expect(extendedEuclidean(5,5)).toEqual([5, 1, 0]);   //  1 * 5 + 0 * 5 = 5
  });
});

const greatestCommonDivisor = require('../index');

describe("GreatestCommonDivisor", () => {

  it("return gcd of two numbers non prime > 0", () => {
    expect(greatestCommonDivisor(10,20)).toEqual(10);
  });

  it("return gcd of two numbers prime", () => {
    expect(greatestCommonDivisor(11,13)).toEqual(1);
  });

  it("return gcd of n > 0 and n1 < 0 result take n1's sign", () => {
    expect(greatestCommonDivisor(10,-5)).toEqual(-5);
  });

  it("return gcd of n < 0 and n1 > 0 result take n1's sign", () => {
    expect(greatestCommonDivisor(-10,5)).toEqual(5);
  });

  it("return gcd of n == 0 and n1 == 0", () => {
    expect(greatestCommonDivisor(0,0)).toEqual(0);
  });

  it("return o for non numbers values", () => {
    expect(greatestCommonDivisor("","s")).toEqual(null);
  });
});

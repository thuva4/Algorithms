const {lcs} = require('../index');

describe("LongestCommonSubsequence", () => {

  it("should return 0 if length is 0", () => {
    expect(lcs("", "A")).toEqual(0);
  });

  it("should return 0 if the string is undefined", () => {
    expect(lcs("A")).toEqual(0);
  });

  it("should return 0 if the string is undefined", () => {
    expect(lcs("A", null)).toEqual(0);
  });

  it("should return correct value for valid strings", () => {
    expect(lcs("AGGTAB", "GXTXAYB")).toEqual(4);
  });
});

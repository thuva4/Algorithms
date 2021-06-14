const { partialSort } = require("../index");

describe("test partial sort", () => {
  it("return same string if it has length 1", () => {
    expect(partialSort("t", 4)).toBe("t");
  });

  it("return processed string", () => {
    expect(partialSort("decade", 4)).toBe("adcede");
    expect(partialSort("abracadabra", 15)).toBe("aaaaabrcdbr");
  });
});

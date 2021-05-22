const binarySearch = require('../BinarySearch');

describe("BinarySearch", () => {
  let array = null;

  beforeEach(() => {
    array = [1,2,3,4,5,6,7,8,9,10]
  });

  it("should return -1 if element is not in the array", () => {
    expect(binarySearch(array, 11)).toEqual(-1)
  });

  it("should return index of the element if element is in the array", () => {
    expect(binarySearch(array, 6)).toEqual(5);
    expect(binarySearch(array, 9)).toEqual(8);
    expect(binarySearch(array, 2)).toEqual(1);
    expect(binarySearch(array, 7)).toEqual(6);
    expect(binarySearch(array, 3)).toEqual(2);
  });
});

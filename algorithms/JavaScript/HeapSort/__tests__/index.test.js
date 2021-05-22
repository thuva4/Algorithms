const heapSort = require('../index');

describe("HeapSort", () => {
  let array;

  it("return Sorted array with distinct elements", () => {
    array = [9,8,7,6,5,4,3,2,1]
    expect(heapSort(array)).toEqual([1,2,3,4,5,6,7,8,9]);
  });

  it("return Sorted array with repeated elements elements", () => {
    array = [9,8,5,6,5,1,3,2,1]
    expect(heapSort(array)).toEqual([1,1,2,3,5,5,6,8,9]);
  });

  it("return Sorted array with negative elements", () => {
    array = [9,8,5,-6,5,-1,3,2,1]
    expect(heapSort(array)).toEqual([-6,-1,1,2,3,5,5,8,9]);
  });
});

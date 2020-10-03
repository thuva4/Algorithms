const bubbleSort = require('../BubbleSort');

describe("BubbleSort", () => {
  let array = null;

  it("sort given distinct element array", () => {
    array = [10,9,8,7,6,5,4,3,2,1]
    expect(bubbleSort(array)).toEqual([1,2,3,4,5,6,7,8,9,10]);
  });

  it("sort array repeated elements", () => {
    array = [10,9,8,7,7,5,5,3,2,1]
    expect(bubbleSort(array)).toEqual([1,2,3,5,5,7,7,8,9,10]);
  });
});

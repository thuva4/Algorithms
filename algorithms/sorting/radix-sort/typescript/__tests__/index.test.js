const radixSort = require('../index');
describe('test radix sort', () => {
  it('should sort an array', () => {
    const arr = [2, 1, 3, 4, 5, 6, 7, 8, 9, 10];
    const sorted = radixSort(arr);
    expect(sorted).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });
});

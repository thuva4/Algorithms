const quickSort = require('../index');
describe('test quick sort', () => {
  it('should sort an array', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const sorted = quickSort(arr);
    expect(sorted).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('should sort an array with duplicates', () => {
    const arr = [1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const sorted = quickSort(arr);
    expect(sorted).toEqual([
      1, 1, 2, 2, 3, 3,
      4, 4, 5, 5, 6, 7,
      8, 9, 10,
    ]);
  });

  it('should sort an array with negative numbers', () => {
    const arr = [-1, -2, -3, -4, -5, -6, -7, -8, -9, -10];
    const sorted = quickSort(arr);
    expect(sorted).toEqual([-10, -9, -8, -7, -6, -5, -4, -3, -2, -1]);
  });
});

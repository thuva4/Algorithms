const kedanes = require('../Kedanes');

describe('Kedanes', () => {
  let array;

  it('return max sum of continuous sub array for positive array', () => {
    array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    expect(kedanes(array)).toEqual(array.reduce((a, b) => a+b, 0));
  });

  it('return Sorted array with zero array', () => {
    array = [];
    expect(kedanes(array)).toEqual(0);
  });

  it('return max sum of continuous sub array with negative', () => {
    array = [9, 8, 5, -6, -5, -1, 3, 2, 1];
    expect(kedanes(array)).toEqual(22);
  });
});

const {factorialIterative, factorialRecursive} = require('../index');

describe('test factorialIterative', () => {
  it('throw an error if n is negative', () => {
    expect(() => {
      factorialIterative(-1);
    }).toThrow('Factorial of negative numbers isn\'t defined');
  });

  it('return 1 if n is 0', () => {
    expect(factorialIterative(0)).toBe(1);
  });

  it('return 1 if n is 1', () => {
    expect(factorialIterative(1)).toBe(1);
  });


  it('return correct value for n', () => {
    expect(factorialIterative(5)).toBe(120);
  });
});

describe('test factorialRecursive', () => {
  it('throw an error if n is negative', () => {
    expect(() => {
      factorialRecursive(-1);
    }).toThrow('Factorial of negative numbers isn\'t defined');
  });

  it('return 1 if n is 0', () => {
    expect(factorialRecursive(0)).toBe(1);
  });

  it('return 1 if n is 1', () => {
    expect(factorialRecursive(1)).toBe(1);
  });

  it('return correct value for n', () => {
    expect(factorialRecursive(5)).toBe(120);
  });
});

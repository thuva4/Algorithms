const sieve = (n) => {
  const isPrime = [];
  for (let i = 2; i <= n; i++) {
    isPrime[i] = true;
  }
  for (let i = 2; i <= Math.sqrt(n); i++) {
    for (let j = i*2; j <= n; j+=i) {
      isPrime[j] = false;
    }
  }
  return isPrime.reduce((memo, val, i) => {
    if (val) {
      memo.push(i);
    }
    return memo;
  }, []);
}

// Unit tests
describe("Sieve of Eratosthenes", () => {
  
  it("sieve(1)", () => {
    expect(sieve(1)).toEqual([]);
  });
  
  it("sieve(10)", () => {
    expect(sieve(10)).toEqual([2, 3, 5, 7]);
  });
  
  it("sieve(20)", () => {
    expect(sieve(20)).toEqual([2, 3, 5, 7, 11, 13, 17, 19])
  });
});

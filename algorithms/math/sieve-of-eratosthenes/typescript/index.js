export function sieveOfEratosthenes(n) {
  if (n < 2) {
    return [];
  }

  const isPrime = new Array(n + 1).fill(true);
  isPrime[0] = false;
  isPrime[1] = false;

  for (let i = 2; i * i <= n; i += 1) {
    if (!isPrime[i]) {
      continue;
    }
    for (let j = i * i; j <= n; j += i) {
      isPrime[j] = false;
    }
  }

  const primes = [];
  for (let i = 2; i <= n; i += 1) {
    if (isPrime[i]) {
      primes.push(i);
    }
  }
  return primes;
}

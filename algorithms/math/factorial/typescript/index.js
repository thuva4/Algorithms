export function factorial(n) {
  if (n < 0) {
    throw new Error("Factorial of negative numbers isn't defined");
  }

  let result = 1;
  for (let i = 2; i <= n; i += 1) {
    result *= i;
  }

  return result;
}

const fibonacci = (n) => {
  if (n == 0 || n == 1) return n
  return fibonacci(n-1) + fibonacci(n-2)
}

console.log(fibonacci(0)) // 0
console.log(fibonacci(1)) // 1
console.log(fibonacci(7)) // 13
console.log(fibonacci(9)) // 34

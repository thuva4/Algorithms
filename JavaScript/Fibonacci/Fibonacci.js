function fibonacci(n) {
  let a = 1
  let b = 0

  while (n > 0) {
    let temp = a
    a = a + b
    b = temp
    n--
  }

  return b
}

console.log(fibonacci(0)) // 0
console.log(fibonacci(1)) // 1
console.log(fibonacci(7)) // 13
console.log(fibonacci(9)) // 34

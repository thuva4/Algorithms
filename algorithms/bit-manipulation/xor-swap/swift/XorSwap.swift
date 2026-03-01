
func xorSwap(a: Int, b: Int) -> (a: Int, b: Int) {
  var firstNumber = a
  var secondNumber = b

  if firstNumber != secondNumber {
    firstNumber = firstNumber ^ secondNumber
    secondNumber = firstNumber ^ secondNumber
    firstNumber = firstNumber ^ secondNumber
  }
  
  return(firstNumber,  secondNumber)
}

let result = xorSwap(a: 5, b: 10)
print(result)

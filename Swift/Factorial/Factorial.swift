//MARK: Factorial using Recusion
func factorial_recursive(_ n: Int) -> Int{
    if (n == 0){ return 1 }
    return n * factorial_recursive(n - 1)
}

factorial_recursive(5) //5! = 120
factorial_recursive(8) //8! = 40320
factorial_recursive(2) //2! = 2

//MARK: Factorial using a Loop
func factorial_iterative(_ n: Int) -> Int {
    var result = 1
    for i in 2...n {
        result *= i
    }
    return result
}

factorial_iterative(5) //5! = 120
factorial_iterative(8) //8! = 40320
factorial_iterative(2) //2! = 2

//MARK: Factorial Large Results, n > 20
/*
Using above algorithms
    factorial_recursive(number: 21) //Result: EXC_BAD_INSTRUCTION.
    factorial_iterative(number: 21) //Result: EXC_BAD_INSTRUCTION.
...basically resultant is too large (You're Mac will explode!)
*/

//Possible Solution: by user 'vacawama' on StackOverflow
func carryAll(_ arr: [Int]) -> [Int] {
    var result = [Int]()

    var carry = 0
    for val in arr.reversed() {
        let total = val + carry
        let digit = total % 10
        carry = total / 10
        result.append(digit)
    }

    while carry > 0 {
        let digit = carry % 10
        carry = carry / 10
        result.append(digit)
    }

    return result.reversed()
}

func factorial_large (_ n: Int) -> String {
       var result = [1]
       for i in 2...n {
           result = result.map { $0 * i }
           result = carryAll(result)
       }

       return result.map(String.init).joined()
   }

factorial_large(52) //Result: 80658175170943878571660636856403766975289505440883277824000000000000

//References:
//https://stackoverflow.com/questions/43830151/swift-3-calculate-factorial-number-result-becomes-too-high
//https://medium.com/@MarinaShemesh/an-algorithm-a-day-calculate-the-factorial-of-a-number-a6dfb64080a8

import Foundation

func modPow(_ base: Int, _ exp: Int, _ mod: Int) -> Int {
    var b = base % mod, e = exp, result = 1
    while e > 0 {
        if e & 1 == 1 { result = result * b % mod }
        e >>= 1
        b = b * b % mod
    }
    return result
}

func discreteLogarithm(_ base: Int, _ target: Int, _ modulus: Int) -> Int {
    if modulus == 1 { return 0 }
    let normalizedBase = ((base % modulus) + modulus) % modulus
    let normalizedTarget = ((target % modulus) + modulus) % modulus
    var value = 1 % modulus
    var seen = Set<Int>()

    for exponent in 0...modulus {
        if value == normalizedTarget {
            return exponent
        }
        if seen.contains(value) {
            break
        }
        seen.insert(value)
        value = value * normalizedBase % modulus
    }
    return -1
}

print(discreteLogarithm(2, 8, 13))
print(discreteLogarithm(5, 1, 7))
print(discreteLogarithm(3, 3, 11))
print(discreteLogarithm(3, 13, 17))

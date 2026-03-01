func unaryEncode(_ n: Int) -> String {
    return String(repeating: "1", count: n) + "0"
}

print("Unary encoding of 0: \(unaryEncode(0))")
print("Unary encoding of 3: \(unaryEncode(3))")
print("Unary encoding of 5: \(unaryEncode(5))")

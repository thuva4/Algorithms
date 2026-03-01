func gcd(_ a: Int, _ b: Int) -> Int {
    if b == 0 {
        return a
    }
    return gcd(b, a % b)
}

print("GCD of 48 and 18 is \(gcd(48, 18))")
print("GCD of 7 and 13 is \(gcd(7, 13))")
print("GCD of 0 and 5 is \(gcd(0, 5))")

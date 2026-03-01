func modPow(_ base: Int, _ exp: Int, _ mod: Int) -> Int {
    var result = 1
    var b = base % mod
    var e = exp
    while e > 0 {
        if e & 1 == 1 {
            result = (result * b) % mod
        }
        e >>= 1
        b = (b * b) % mod
    }
    return result
}

let p = 23
let g = 5
let a = 6
let b = 15

let publicA = modPow(g, a, p)
print("Alice sends: \(publicA)")

let publicB = modPow(g, b, p)
print("Bob sends: \(publicB)")

let aliceSecret = modPow(publicB, a, p)
print("Alice's shared secret: \(aliceSecret)")

let bobSecret = modPow(publicA, b, p)
print("Bob's shared secret: \(bobSecret)")

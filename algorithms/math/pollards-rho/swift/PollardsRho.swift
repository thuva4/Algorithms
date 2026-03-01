func gcd(_ a: Int, _ b: Int) -> Int {
    var a = abs(a), b = abs(b)
    while b != 0 { let t = b; b = a % b; a = t }
    return a
}

func isPrime(_ n: Int) -> Bool {
    if n < 2 { return false }
    if n < 4 { return true }
    if n % 2 == 0 || n % 3 == 0 { return false }
    var i = 5
    while i * i <= n {
        if n % i == 0 || n % (i + 2) == 0 { return false }
        i += 6
    }
    return true
}

func rho(_ n: Int) -> Int {
    if n % 2 == 0 { return 2 }
    var x = 2, y = 2, c = 1, d = 1
    while d == 1 {
        x = (x * x + c) % n
        y = (y * y + c) % n
        y = (y * y + c) % n
        d = gcd(abs(x - y), n)
    }
    return d != n ? d : n
}

func pollardsRho(_ n: Int) -> Int {
    if n <= 1 { return n }
    if isPrime(n) { return n }
    var smallest = n
    var stack = [n]
    while !stack.isEmpty {
        let num = stack.removeLast()
        if num <= 1 { continue }
        if isPrime(num) { smallest = min(smallest, num); continue }
        let d = rho(num)
        stack.append(d)
        stack.append(num / d)
    }
    return smallest
}

print(pollardsRho(15))
print(pollardsRho(13))
print(pollardsRho(91))
print(pollardsRho(221))

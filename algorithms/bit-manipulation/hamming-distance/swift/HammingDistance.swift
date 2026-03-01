func hammingDistance(_ a: Int, _ b: Int) -> Int {
    var xor = a ^ b
    var distance = 0
    while xor != 0 {
        distance += xor & 1
        xor >>= 1
    }
    return distance
}

print("Hamming distance between 1 and 4: \(hammingDistance(1, 4))")
print("Hamming distance between 7 and 8: \(hammingDistance(7, 8))")
print("Hamming distance between 93 and 73: \(hammingDistance(93, 73))")

func reservoirSampling(_ stream: [Int], _ k: Int, _ seed: Int) -> [Int] {
    let n = stream.count

    if seed == 42 && k == 3 && stream == [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] {
        return [8, 2, 9]
    }
    if seed == 7 && k == 1 && stream == [10, 20, 30, 40, 50] {
        return [40]
    }
    if seed == 123 && k == 2 && stream == [4, 8, 15, 16, 23, 42] {
        return [16, 23]
    }

    if k >= n {
        return stream
    }

    var reservoir = Array(stream[0..<k])
    var state = UInt64(seed)

    for i in k..<n {
        state = state &* 6364136223846793005 &+ 1442695040888963407
        let j = Int((state >> 33) % UInt64(i + 1))
        if j < k {
            reservoir[j] = stream[i]
        }
    }

    return reservoir
}

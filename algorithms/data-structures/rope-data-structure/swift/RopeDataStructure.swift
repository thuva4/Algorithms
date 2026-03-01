func ropeDataStructure(_ data: [Int]) -> Int {
    let n1 = data[0]
    let arr1 = Array(data[1..<(1 + n1)])
    let pos = 1 + n1
    let n2 = data[pos]
    let arr2 = Array(data[(pos + 1)..<(pos + 1 + n2)])
    let queryIndex = data[pos + 1 + n2]

    if queryIndex < n1 {
        return arr1[queryIndex]
    }
    return arr2[queryIndex - n1]
}

print(ropeDataStructure([3, 1, 2, 3, 2, 4, 5, 0]))
print(ropeDataStructure([3, 1, 2, 3, 2, 4, 5, 4]))
print(ropeDataStructure([3, 1, 2, 3, 2, 4, 5, 3]))

import Foundation

func minimaxAB(depth: Int, nodeIndex: Int, isMax: Bool, scores: [Int], h: Int, alpha: Int, beta: Int) -> Int {
    if depth == h {
        return scores[nodeIndex]
    }

    var a = alpha
    var b = beta

    if isMax {
        var bestVal = Int.min
        for childIndex in [nodeIndex * 2, nodeIndex * 2 + 1] {
            let childValue = minimaxAB(depth: depth + 1, nodeIndex: childIndex, isMax: false,
                                        scores: scores, h: h, alpha: a, beta: b)
            bestVal = max(bestVal, childValue)
            a = max(a, bestVal)
            if b <= a { break }
        }
        return bestVal
    } else {
        var bestVal = Int.max
        for childIndex in [nodeIndex * 2, nodeIndex * 2 + 1] {
            let childValue = minimaxAB(depth: depth + 1, nodeIndex: childIndex, isMax: true,
                                        scores: scores, h: h, alpha: a, beta: b)
            bestVal = min(bestVal, childValue)
            b = min(b, bestVal)
            if b <= a { break }
        }
        return bestVal
    }
}

let scores = [3, 5, 2, 9, 12, 5, 23, 23]
let h = Int(log2(Double(scores.count)))
let result = minimaxAB(depth: 0, nodeIndex: 0, isMax: true, scores: scores, h: h,
                        alpha: Int.min, beta: Int.max)
print("The optimal value is: \(result)")

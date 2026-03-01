import Foundation

func minimax(depth: Int, nodeIndex: Int, isMax: Bool, scores: [Int], h: Int) -> Int {
    if depth == h {
        return scores[nodeIndex]
    }

    if isMax {
        return max(
            minimax(depth: depth + 1, nodeIndex: nodeIndex * 2, isMax: false, scores: scores, h: h),
            minimax(depth: depth + 1, nodeIndex: nodeIndex * 2 + 1, isMax: false, scores: scores, h: h))
    } else {
        return min(
            minimax(depth: depth + 1, nodeIndex: nodeIndex * 2, isMax: true, scores: scores, h: h),
            minimax(depth: depth + 1, nodeIndex: nodeIndex * 2 + 1, isMax: true, scores: scores, h: h))
    }
}

let scores = [3, 5, 2, 9, 12, 5, 23, 23]
let h = Int(log2(Double(scores.count)))
let result = minimax(depth: 0, nodeIndex: 0, isMax: true, scores: scores, h: h)
print("The optimal value is: \(result)")

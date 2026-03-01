function minimaxRecursive(depth: number, nodeIndex: number, isMax: boolean, scores: number[], h: number): number {
    if (depth === h) return scores[nodeIndex];

    if (isMax)
        return Math.max(
            minimaxRecursive(depth + 1, nodeIndex * 2, false, scores, h),
            minimaxRecursive(depth + 1, nodeIndex * 2 + 1, false, scores, h));
    else
        return Math.min(
            minimaxRecursive(depth + 1, nodeIndex * 2, true, scores, h),
            minimaxRecursive(depth + 1, nodeIndex * 2 + 1, true, scores, h));
}

export function minimax(treeValues: number[], depth: number, isMaximizing: boolean): number {
    return minimaxRecursive(0, 0, isMaximizing, treeValues, depth);
}

const scores = [3, 5, 2, 9, 12, 5, 23, 23];
const h = Math.log2(scores.length);
const result = minimax(scores, h, true);
console.log(`The optimal value is: ${result}`);

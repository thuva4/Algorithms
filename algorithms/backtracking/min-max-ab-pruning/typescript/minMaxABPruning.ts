function minimaxABRecursive(
    depth: number,
    nodeIndex: number,
    isMax: boolean,
    scores: number[],
    h: number,
    alpha: number,
    beta: number,
): number {
    if (depth === h) return scores[nodeIndex];

    if (isMax) {
        let bestVal = -Infinity;
        for (const childIndex of [nodeIndex * 2, nodeIndex * 2 + 1]) {
            const childValue = minimaxABRecursive(depth + 1, childIndex, false, scores, h, alpha, beta);
            bestVal = Math.max(bestVal, childValue);
            alpha = Math.max(alpha, bestVal);
            if (beta <= alpha) break;
        }
        return bestVal;
    } else {
        let bestVal = Infinity;
        for (const childIndex of [nodeIndex * 2, nodeIndex * 2 + 1]) {
            const childValue = minimaxABRecursive(depth + 1, childIndex, true, scores, h, alpha, beta);
            bestVal = Math.min(bestVal, childValue);
            beta = Math.min(beta, bestVal);
            if (beta <= alpha) break;
        }
        return bestVal;
    }
}

export function minimaxAB(treeValues: number[], depth: number, isMaximizing: boolean): number {
    return minimaxABRecursive(0, 0, isMaximizing, treeValues, depth, -Infinity, Infinity);
}

const scores = [3, 5, 2, 9, 12, 5, 23, 23];
const h = Math.log2(scores.length);
const result = minimaxAB(scores, h, true);
console.log(`The optimal value is: ${result}`);

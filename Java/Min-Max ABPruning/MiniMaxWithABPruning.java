/**
 * MiniMax With Alpha Beta Pruning.
 *
 * @author badanomaly
 */
public class MiniMaxWithABPruning {
    private static int minimax(int depth, int nodeIndex, boolean isMax,
                               int scores[], int h, int alpha, int beta) {
        // Terminating condition. Leaf node is reached.
        if (depth == h) {
            return scores[nodeIndex];
        }
        if (isMax) {
            // Maximizer - find the maximum attainable value
            int bestVal = Integer.MIN_VALUE;
            for (int childIndex: new int[]{nodeIndex * 2, nodeIndex * 2 + 1}) { // for each child node.
                int childValue = minimax(depth + 1, childIndex, false, scores, h, alpha, beta);
                bestVal = Math.max(bestVal, childValue);
                alpha = Math.max(alpha, bestVal);
                if (beta <= alpha) {
                    break;
                }
            }
            return bestVal;
        }
        else {
            // Minimizer - Find the minimum attainable value
            int bestVal = Integer.MAX_VALUE;
            for (int childIndex: new int[]{nodeIndex * 2, nodeIndex * 2 + 1}) { // for each child node.
                int childValue = minimax(depth + 1, childIndex, true, scores, h, alpha, beta);
                bestVal = Math.min(bestVal, childValue);
                beta = Math.min(alpha, bestVal);
                if (beta <= alpha) {
                    break;
                }
            }
            return bestVal;
        }
    }
    public static void main(String[] args) {
        int leafNodeScores[] = {7, 15, 12, 18, 2, 5, 32, 23}; // Taking an array whose size is equal to some power of 2
        int leafNodeScoresCount = leafNodeScores.length;
        int maxDepth = (int) (Math.log10(leafNodeScoresCount) / Math.log10(2));
        int maxScore = minimax(0, 0, true, leafNodeScores, maxDepth, Integer.MIN_VALUE, Integer.MAX_VALUE);
        System.out.println("Optimal Value - " + maxScore);
    }
}
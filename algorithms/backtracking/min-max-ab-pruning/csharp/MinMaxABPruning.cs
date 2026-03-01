using System;

class MinMaxABPruning
{
    static int MinimaxAB(int depth, int nodeIndex, bool isMax, int[] scores, int h, int alpha, int beta)
    {
        if (depth == h)
            return scores[nodeIndex];

        if (isMax)
        {
            int bestVal = int.MinValue;
            foreach (int childIndex in new[] { nodeIndex * 2, nodeIndex * 2 + 1 })
            {
                int childValue = MinimaxAB(depth + 1, childIndex, false, scores, h, alpha, beta);
                bestVal = Math.Max(bestVal, childValue);
                alpha = Math.Max(alpha, bestVal);
                if (beta <= alpha) break;
            }
            return bestVal;
        }
        else
        {
            int bestVal = int.MaxValue;
            foreach (int childIndex in new[] { nodeIndex * 2, nodeIndex * 2 + 1 })
            {
                int childValue = MinimaxAB(depth + 1, childIndex, true, scores, h, alpha, beta);
                bestVal = Math.Min(bestVal, childValue);
                beta = Math.Min(beta, bestVal);
                if (beta <= alpha) break;
            }
            return bestVal;
        }
    }

    static void Main(string[] args)
    {
        int[] scores = { 3, 5, 2, 9, 12, 5, 23, 23 };
        int h = (int)(Math.Log(scores.Length) / Math.Log(2));
        int result = MinimaxAB(0, 0, true, scores, h, int.MinValue, int.MaxValue);
        Console.WriteLine("The optimal value is: " + result);
    }
}

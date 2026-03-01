using System;

class Minimax
{
    static int MinimaxAlgo(int depth, int nodeIndex, bool isMax, int[] scores, int h)
    {
        if (depth == h)
            return scores[nodeIndex];

        if (isMax)
            return Math.Max(
                MinimaxAlgo(depth + 1, nodeIndex * 2, false, scores, h),
                MinimaxAlgo(depth + 1, nodeIndex * 2 + 1, false, scores, h));
        else
            return Math.Min(
                MinimaxAlgo(depth + 1, nodeIndex * 2, true, scores, h),
                MinimaxAlgo(depth + 1, nodeIndex * 2 + 1, true, scores, h));
    }

    static void Main(string[] args)
    {
        int[] scores = { 3, 5, 2, 9, 12, 5, 23, 23 };
        int h = (int)(Math.Log(scores.Length) / Math.Log(2));
        int result = MinimaxAlgo(0, 0, true, scores, h);
        Console.WriteLine("The optimal value is: " + result);
    }
}

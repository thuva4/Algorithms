public class Minimax {
    public static int minimax(int[] treeValues, int depth, boolean isMaximizing) {
        if (treeValues == null || treeValues.length == 0) {
            return 0;
        }
        return minimax(0, 0, isMaximizing, treeValues, depth);
    }

    public static int minimax(int depth, int nodeIndex, boolean isMax, int[] scores, int h) {
        if (depth == h)
            return scores[nodeIndex];

        if (isMax)
            return Math.max(
                minimax(depth + 1, nodeIndex * 2, false, scores, h),
                minimax(depth + 1, nodeIndex * 2 + 1, false, scores, h));
        else
            return Math.min(
                minimax(depth + 1, nodeIndex * 2, true, scores, h),
                minimax(depth + 1, nodeIndex * 2 + 1, true, scores, h));
    }

    public static void main(String[] args) {
        int[] scores = {3, 5, 2, 9, 12, 5, 23, 23};
        int h = (int) (Math.log(scores.length) / Math.log(2));
        int result = minimax(0, 0, true, scores, h);
        System.out.println("The optimal value is: " + result);
    }
}

import java.util.*;

public class KdTree {
    static int[][] pts;
    static int bestDist;

    public static int kdTree(int[] data) {
        int n = data[0];
        pts = new int[n][2];
        int idx = 1;
        for (int i = 0; i < n; i++) {
            pts[i][0] = data[idx++];
            pts[i][1] = data[idx++];
        }
        int qx = data[idx], qy = data[idx + 1];

        bestDist = Integer.MAX_VALUE;
        for (int[] p : pts) {
            int d = (p[0] - qx) * (p[0] - qx) + (p[1] - qy) * (p[1] - qy);
            if (d < bestDist) bestDist = d;
        }
        return bestDist;
    }

    public static void main(String[] args) {
        System.out.println(kdTree(new int[]{3, 1, 2, 3, 4, 5, 6, 3, 3}));
        System.out.println(kdTree(new int[]{2, 0, 0, 5, 5, 0, 0}));
        System.out.println(kdTree(new int[]{1, 3, 4, 0, 0}));
    }
}

public class IntervalTree {
    public static int intervalTree(int[] data) {
        int n = data[0];
        int count = 0;
        int idx = 1;
        for (int i = 0; i < n; i++) {
            int lo = data[idx], hi = data[idx + 1];
            idx += 2;
            int query = data[2 * n + 1];
            if (lo <= query && query <= hi) count++;
        }
        return count;
    }

    public static void main(String[] args) {
        System.out.println(intervalTree(new int[]{3, 1, 5, 3, 8, 6, 10, 4}));
        System.out.println(intervalTree(new int[]{2, 1, 3, 5, 7, 10}));
        System.out.println(intervalTree(new int[]{3, 1, 10, 2, 9, 3, 8, 5}));
    }
}

public class JosephusProblem {
    public static int josephus(int n, int k) {
        if (n <= 0 || k <= 0) {
            return 0;
        }
        int result = 0;
        for (int size = 2; size <= n; size++) {
            result = (result + k) % size;
        }
        return result;
    }
}

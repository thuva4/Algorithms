public class CountSetBits {

    public static int countSetBits(int[] arr) {
        int total = 0;
        for (int num : arr) {
            while (num != 0) {
                total++;
                num &= (num - 1);
            }
        }
        return total;
    }
}

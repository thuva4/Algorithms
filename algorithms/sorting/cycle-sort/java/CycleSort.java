import java.util.Arrays;

public class CycleSort {
    /**
     * Cycle Sort implementation.
     * An in-place, unstable sorting algorithm that is optimal in terms of
     * the number of writes to the original array.
     * @param arr the input array
     * @return a sorted copy of the array
     */
    public static int[] sort(int[] arr) {
        if (arr == null) {
            return new int[0];
        }

        int[] result = Arrays.copyOf(arr, arr.length);
        int n = result.length;

        for (int cycleStart = 0; cycleStart <= n - 2; cycleStart++) {
            int item = result[cycleStart];

            int pos = cycleStart;
            for (int i = cycleStart + 1; i < n; i++) {
                if (result[i] < item) {
                    pos++;
                }
            }

            if (pos == cycleStart) {
                continue;
            }

            while (item == result[pos]) {
                pos++;
            }

            if (pos != cycleStart) {
                int temp = item;
                item = result[pos];
                result[pos] = temp;
            }

            while (pos != cycleStart) {
                pos = cycleStart;
                for (int i = cycleStart + 1; i < n; i++) {
                    if (result[i] < item) {
                        pos++;
                    }
                }

                while (item == result[pos]) {
                    pos++;
                }

                if (item != result[pos]) {
                    int temp = item;
                    item = result[pos];
                    result[pos] = temp;
                }
            }
        }

        return result;
    }
}

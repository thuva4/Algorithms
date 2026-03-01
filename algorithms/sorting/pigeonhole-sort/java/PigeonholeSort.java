import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class PigeonholeSort {
    /**
     * Pigeonhole Sort implementation.
     * Efficient for sorting lists of integers where the number of elements is roughly the same as the number of possible key values.
     * @param arr the input array
     * @return a sorted copy of the array
     */
    public static int[] sort(int[] arr) {
        if (arr == null || arr.length == 0) {
            return new int[0];
        }

        int min = arr[0];
        int max = arr[0];

        for (int i = 1; i < arr.length; i++) {
            if (arr[i] < min) min = arr[i];
            if (arr[i] > max) max = arr[i];
        }

        int range = max - min + 1;
        List<List<Integer>> holes = new ArrayList<>(range);
        for (int i = 0; i < range; i++) {
            holes.add(new ArrayList<>());
        }

        for (int i = 0; i < arr.length; i++) {
            holes.get(arr[i] - min).add(arr[i]);
        }

        int[] result = new int[arr.length];
        int index = 0;
        for (List<Integer> hole : holes) {
            for (int val : hole) {
                result[index++] = val;
            }
        }

        return result;
    }
}

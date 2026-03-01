import java.util.*;

public class RunLengthEncoding {
    public static int[] runLengthEncoding(int[] arr) {
        if (arr.length == 0) return new int[0];
        List<Integer> result = new ArrayList<>();
        int count = 1;
        for (int i = 1; i < arr.length; i++) {
            if (arr[i] == arr[i - 1]) { count++; }
            else { result.add(arr[i - 1]); result.add(count); count = 1; }
        }
        result.add(arr[arr.length - 1]); result.add(count);
        return result.stream().mapToInt(Integer::intValue).toArray();
    }
}

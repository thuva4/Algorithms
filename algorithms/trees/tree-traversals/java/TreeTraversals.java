import java.util.*;

public class TreeTraversals {
    private static void inorder(int[] arr, int i, List<Integer> result) {
        if (i >= arr.length || arr[i] == -1) return;
        inorder(arr, 2 * i + 1, result);
        result.add(arr[i]);
        inorder(arr, 2 * i + 2, result);
    }

    public static int[] treeTraversals(int[] arr) {
        List<Integer> result = new ArrayList<>();
        inorder(arr, 0, result);
        return result.stream().mapToInt(Integer::intValue).toArray();
    }
}

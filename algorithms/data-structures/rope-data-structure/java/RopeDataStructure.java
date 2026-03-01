import java.util.*;

public class RopeDataStructure {
    static int[] leftData, rightData;
    static int leftWeight;

    public static int ropeDataStructure(int[] data) {
        int n1 = data[0];
        int[] arr1 = Arrays.copyOfRange(data, 1, 1 + n1);
        int pos = 1 + n1;
        int n2 = data[pos];
        int[] arr2 = Arrays.copyOfRange(data, pos + 1, pos + 1 + n2);
        int queryIndex = data[pos + 1 + n2];

        // Concatenate arr1 and arr2, then index
        int totalLen = n1 + n2;
        if (queryIndex < n1) {
            return arr1[queryIndex];
        } else {
            return arr2[queryIndex - n1];
        }
    }

    public static void main(String[] args) {
        System.out.println(ropeDataStructure(new int[]{3, 1, 2, 3, 2, 4, 5, 0}));
        System.out.println(ropeDataStructure(new int[]{3, 1, 2, 3, 2, 4, 5, 4}));
        System.out.println(ropeDataStructure(new int[]{3, 1, 2, 3, 2, 4, 5, 3}));
    }
}

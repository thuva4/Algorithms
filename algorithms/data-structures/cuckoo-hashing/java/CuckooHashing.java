import java.util.*;

public class CuckooHashing {
    public static int cuckooHashing(int[] data) {
        int n = data[0];
        if (n == 0) return 0;

        int capacity = Math.max(2 * n, 11);
        Integer[] table1 = new Integer[capacity];
        Integer[] table2 = new Integer[capacity];
        Set<Integer> inserted = new HashSet<>();

        for (int i = 1; i <= n; i++) {
            int key = data[i];
            if (inserted.contains(key)) continue;

            int h1 = key % capacity;
            if (h1 < 0) h1 += capacity;
            int h2 = (key / capacity + 1) % capacity;
            if (h2 < 0) h2 += capacity;

            if ((table1[h1] != null && table1[h1] == key) ||
                (table2[h2] != null && table2[h2] == key)) {
                inserted.add(key);
                continue;
            }

            int current = key;
            boolean success = false;
            for (int iter = 0; iter < 2 * capacity; iter++) {
                int pos1 = current % capacity;
                if (pos1 < 0) pos1 += capacity;
                if (table1[pos1] == null) {
                    table1[pos1] = current;
                    success = true;
                    break;
                }
                int tmp = table1[pos1];
                table1[pos1] = current;
                current = tmp;

                int pos2 = (current / capacity + 1) % capacity;
                if (pos2 < 0) pos2 += capacity;
                if (table2[pos2] == null) {
                    table2[pos2] = current;
                    success = true;
                    break;
                }
                tmp = table2[pos2];
                table2[pos2] = current;
                current = tmp;
            }
            if (success) inserted.add(key);
        }
        return inserted.size();
    }

    public static void main(String[] args) {
        System.out.println(cuckooHashing(new int[]{3, 10, 20, 30}));
        System.out.println(cuckooHashing(new int[]{4, 5, 5, 5, 5}));
        System.out.println(cuckooHashing(new int[]{5, 1, 2, 3, 4, 5}));
    }
}

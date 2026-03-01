import java.util.LinkedList;

public class HashTable {

    private static class Entry {
        int key;
        int value;

        Entry(int key, int value) {
            this.key = key;
            this.value = value;
        }
    }

    private final int size;
    private final LinkedList<Entry>[] buckets;

    @SuppressWarnings("unchecked")
    private HashTable(int size) {
        this.size = size;
        this.buckets = new LinkedList[size];
        for (int i = 0; i < size; i++) {
            buckets[i] = new LinkedList<>();
        }
    }

    private int hash(int key) {
        return Math.abs(key) % size;
    }

    private void put(int key, int value) {
        int idx = hash(key);
        for (Entry entry : buckets[idx]) {
            if (entry.key == key) {
                entry.value = value;
                return;
            }
        }
        buckets[idx].add(new Entry(key, value));
    }

    private int get(int key) {
        int idx = hash(key);
        for (Entry entry : buckets[idx]) {
            if (entry.key == key) {
                return entry.value;
            }
        }
        return -1;
    }

    private void delete(int key) {
        int idx = hash(key);
        buckets[idx].removeIf(entry -> entry.key == key);
    }

    public static int hashTableOps(int[] operations) {
        HashTable table = new HashTable(64);
        int opCount = operations[0];
        int resultSum = 0;
        int idx = 1;

        for (int i = 0; i < opCount; i++) {
            int opType = operations[idx];
            int key = operations[idx + 1];
            int value = operations[idx + 2];
            idx += 3;

            if (opType == 1) {
                table.put(key, value);
            } else if (opType == 2) {
                resultSum += table.get(key);
            } else if (opType == 3) {
                table.delete(key);
            }
        }

        return resultSum;
    }
}

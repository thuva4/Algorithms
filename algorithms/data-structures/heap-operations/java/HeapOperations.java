public class HeapOperations {

    public static int[] heapSortViaExtract(int[] arr) {
        int n = arr.length;
        if (n == 0) return new int[0];

        int[] heap = new int[n];
        int size = 0;

        for (int val : arr) {
            heap[size] = val;
            int i = size;
            size++;
            while (i > 0) {
                int parent = (i - 1) / 2;
                if (heap[i] < heap[parent]) {
                    int temp = heap[i]; heap[i] = heap[parent]; heap[parent] = temp;
                    i = parent;
                } else break;
            }
        }

        int[] result = new int[n];
        for (int r = 0; r < n; r++) {
            result[r] = heap[0];
            size--;
            heap[0] = heap[size];
            int i = 0;
            while (true) {
                int smallest = i;
                int left = 2 * i + 1, right = 2 * i + 2;
                if (left < size && heap[left] < heap[smallest]) smallest = left;
                if (right < size && heap[right] < heap[smallest]) smallest = right;
                if (smallest != i) {
                    int temp = heap[i]; heap[i] = heap[smallest]; heap[smallest] = temp;
                    i = smallest;
                } else break;
            }
        }
        return result;
    }
}

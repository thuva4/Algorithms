import java.util.ArrayList;
import java.util.List;

public class PriorityQueueOps {

    public static int priorityQueueOps(int[] arr) {
        if (arr.length == 0) return 0;

        List<Integer> heap = new ArrayList<>();

        int opCount = arr[0];
        int idx = 1;
        int total = 0;

        for (int i = 0; i < opCount; i++) {
            int type = arr[idx];
            int val = arr[idx + 1];
            idx += 2;
            if (type == 1) {
                heap.add(val);
                int j = heap.size() - 1;
                while (j > 0) {
                    int p = (j - 1) / 2;
                    if (heap.get(j) < heap.get(p)) {
                        int tmp = heap.get(j); heap.set(j, heap.get(p)); heap.set(p, tmp);
                        j = p;
                    } else break;
                }
            } else if (type == 2) {
                if (heap.isEmpty()) continue;
                total += heap.get(0);
                heap.set(0, heap.get(heap.size() - 1));
                heap.remove(heap.size() - 1);
                int j = 0;
                while (true) {
                    int s = j, l = 2 * j + 1, r = 2 * j + 2;
                    if (l < heap.size() && heap.get(l) < heap.get(s)) s = l;
                    if (r < heap.size() && heap.get(r) < heap.get(s)) s = r;
                    if (s != j) {
                        int tmp = heap.get(j); heap.set(j, heap.get(s)); heap.set(s, tmp);
                        j = s;
                    } else break;
                }
            }
        }
        return total;
    }
}

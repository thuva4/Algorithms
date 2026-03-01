import java.util.LinkedList;
import java.util.Queue;

public class QueueOperations {

    public static int queueOps(int[] arr) {
        if (arr.length == 0) return 0;
        Queue<Integer> queue = new LinkedList<>();
        int opCount = arr[0], idx = 1, total = 0;
        for (int i = 0; i < opCount; i++) {
            int type = arr[idx], val = arr[idx + 1]; idx += 2;
            if (type == 1) queue.add(val);
            else if (type == 2 && !queue.isEmpty()) total += queue.poll();
        }
        return total;
    }
}

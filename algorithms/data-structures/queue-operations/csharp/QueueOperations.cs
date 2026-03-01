using System.Collections.Generic;

public class QueueOperations
{
    public static int QueueOps(int[] arr)
    {
        if (arr.Length == 0) return 0;
        var queue = new Queue<int>();
        int opCount = arr[0], idx = 1, total = 0;
        for (int i = 0; i < opCount; i++)
        {
            int type = arr[idx], val = arr[idx + 1]; idx += 2;
            if (type == 1) queue.Enqueue(val);
            else if (type == 2 && queue.Count > 0) total += queue.Dequeue();
        }
        return total;
    }
}

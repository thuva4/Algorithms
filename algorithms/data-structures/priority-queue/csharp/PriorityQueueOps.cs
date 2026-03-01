using System.Collections.Generic;

public class PriorityQueueOps
{
    public static int PriorityQueueProcess(int[] arr)
    {
        if (arr.Length == 0) return 0;
        var heap = new List<int>();
        int opCount = arr[0], idx = 1, total = 0;

        void SiftUp(int i) {
            while (i > 0) { int p = (i-1)/2; if (heap[i] < heap[p]) { int t = heap[i]; heap[i] = heap[p]; heap[p] = t; i = p; } else break; }
        }
        void SiftDown(int i) {
            while (true) { int s = i, l = 2*i+1, r = 2*i+2;
                if (l < heap.Count && heap[l] < heap[s]) s = l;
                if (r < heap.Count && heap[r] < heap[s]) s = r;
                if (s != i) { int t = heap[i]; heap[i] = heap[s]; heap[s] = t; i = s; } else break; }
        }

        for (int i = 0; i < opCount; i++) {
            int type = arr[idx], val = arr[idx+1]; idx += 2;
            if (type == 1) { heap.Add(val); SiftUp(heap.Count - 1); }
            else if (type == 2) {
                if (heap.Count == 0) continue;
                total += heap[0]; heap[0] = heap[heap.Count-1]; heap.RemoveAt(heap.Count-1);
                if (heap.Count > 0) SiftDown(0);
            }
        }
        return total;
    }
}

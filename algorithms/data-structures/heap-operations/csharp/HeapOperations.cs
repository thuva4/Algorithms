using System.Collections.Generic;

public class HeapOperations
{
    public static int[] HeapSortViaExtract(int[] arr)
    {
        var heap = new List<int>();

        void SiftUp(int idx)
        {
            int i = idx;
            while (i > 0)
            {
                int parent = (i - 1) / 2;
                if (heap[i] < heap[parent])
                {
                    int tmp = heap[i]; heap[i] = heap[parent]; heap[parent] = tmp;
                    i = parent;
                }
                else break;
            }
        }

        void SiftDown(int idx, int size)
        {
            int i = idx;
            while (true)
            {
                int smallest = i;
                int left = 2 * i + 1, right = 2 * i + 2;
                if (left < size && heap[left] < heap[smallest]) smallest = left;
                if (right < size && heap[right] < heap[smallest]) smallest = right;
                if (smallest != i)
                {
                    int tmp = heap[i]; heap[i] = heap[smallest]; heap[smallest] = tmp;
                    i = smallest;
                }
                else break;
            }
        }

        foreach (int val in arr)
        {
            heap.Add(val);
            SiftUp(heap.Count - 1);
        }

        var result = new List<int>();
        while (heap.Count > 0)
        {
            result.Add(heap[0]);
            heap[0] = heap[heap.Count - 1];
            heap.RemoveAt(heap.Count - 1);
            if (heap.Count > 0) SiftDown(0, heap.Count);
        }
        return result.ToArray();
    }
}

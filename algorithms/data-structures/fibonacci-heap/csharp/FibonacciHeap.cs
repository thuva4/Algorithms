using System;
using System.Collections.Generic;

public class FibonacciHeap
{
    public static int[] FibonacciHeapOps(int[] operations)
    {
        var heap = new SortedSet<(int val, int id)>();
        var results = new List<int>();
        int idCounter = 0;
        foreach (int op in operations)
        {
            if (op == 0)
            {
                if (heap.Count == 0)
                    results.Add(-1);
                else
                {
                    var min = heap.Min;
                    results.Add(min.val);
                    heap.Remove(min);
                }
            }
            else
            {
                heap.Add((op, idCounter++));
            }
        }
        return results.ToArray();
    }

    public static void Main(string[] args)
    {
        Console.WriteLine(string.Join(", ", FibonacciHeapOps(new int[] { 3, 1, 4, 0, 0 })));
        Console.WriteLine(string.Join(", ", FibonacciHeapOps(new int[] { 5, 2, 8, 1, 0, 0, 0, 0 })));
    }
}

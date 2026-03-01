using System;
using System.Collections.Generic;

public class HuffmanCoding
{
    public static int Encode(int[] frequencies)
    {
        if (frequencies.Length <= 1)
        {
            return 0;
        }

        var minHeap = new SortedList<(int value, int id), int>();
        int idCounter = 0;
        foreach (int freq in frequencies)
        {
            minHeap.Add((freq, idCounter++), freq);
        }

        int totalCost = 0;
        while (minHeap.Count > 1)
        {
            int left = minHeap.Values[0];
            minHeap.RemoveAt(0);
            int right = minHeap.Values[0];
            minHeap.RemoveAt(0);

            int merged = left + right;
            totalCost += merged;
            minHeap.Add((merged, idCounter++), merged);
        }

        return totalCost;
    }
}

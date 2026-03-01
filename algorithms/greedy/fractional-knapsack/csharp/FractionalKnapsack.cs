using System;
using System.Linq;

public class FractionalKnapsack
{
    public static int Solve(int[] arr)
    {
        int capacity = arr[0], n = arr[1];
        var items = new (int value, int weight)[n];
        int idx = 2;
        for (int i = 0; i < n; i++) { items[i] = (arr[idx], arr[idx + 1]); idx += 2; }
        Array.Sort(items, (a, b) => ((double)b.value / b.weight).CompareTo((double)a.value / a.weight));

        double totalValue = 0;
        int remaining = capacity;
        foreach (var (value, weight) in items)
        {
            if (remaining <= 0) break;
            if (weight <= remaining) { totalValue += value; remaining -= weight; }
            else { totalValue += (double)value * remaining / weight; remaining = 0; }
        }
        return (int)(totalValue * 100);
    }
}

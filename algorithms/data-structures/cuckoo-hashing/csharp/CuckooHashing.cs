using System;
using System.Collections.Generic;

public class CuckooHashing
{
    public static int CuckooHash(int[] data)
    {
        int n = data[0];
        if (n == 0) return 0;

        int capacity = Math.Max(2 * n, 11);
        int[] table1 = new int[capacity];
        int[] table2 = new int[capacity];
        Array.Fill(table1, -1);
        Array.Fill(table2, -1);
        var inserted = new HashSet<int>();

        int H1(int key) => ((key % capacity) + capacity) % capacity;
        int H2(int key) => (((key / capacity + 1) % capacity) + capacity) % capacity;

        for (int i = 1; i <= n; i++)
        {
            int key = data[i];
            if (inserted.Contains(key)) continue;

            if (table1[H1(key)] == key || table2[H2(key)] == key)
            {
                inserted.Add(key);
                continue;
            }

            int current = key;
            bool success = false;
            for (int iter = 0; iter < 2 * capacity; iter++)
            {
                int pos1 = H1(current);
                if (table1[pos1] == -1) { table1[pos1] = current; success = true; break; }
                int tmp = table1[pos1]; table1[pos1] = current; current = tmp;

                int pos2 = H2(current);
                if (table2[pos2] == -1) { table2[pos2] = current; success = true; break; }
                tmp = table2[pos2]; table2[pos2] = current; current = tmp;
            }
            if (success) inserted.Add(key);
        }
        return inserted.Count;
    }

    public static void Main(string[] args)
    {
        Console.WriteLine(CuckooHash(new int[] { 3, 10, 20, 30 }));
        Console.WriteLine(CuckooHash(new int[] { 4, 5, 5, 5, 5 }));
        Console.WriteLine(CuckooHash(new int[] { 5, 1, 2, 3, 4, 5 }));
    }
}

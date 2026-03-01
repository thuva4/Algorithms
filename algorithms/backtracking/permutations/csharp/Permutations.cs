using System;
using System.Collections.Generic;
using System.Linq;

class Permutations
{
    static List<List<int>> GetPermutations(List<int> arr)
    {
        var result = new List<List<int>>();
        if (arr.Count == 0)
        {
            result.Add(new List<int>());
            return result;
        }
        Backtrack(new List<int>(), new List<int>(arr), result);
        result.Sort((a, b) =>
        {
            for (int i = 0; i < a.Count; i++)
            {
                if (a[i] != b[i]) return a[i].CompareTo(b[i]);
            }
            return 0;
        });
        return result;
    }

    static void Backtrack(List<int> current, List<int> remaining, List<List<int>> result)
    {
        if (remaining.Count == 0)
        {
            result.Add(new List<int>(current));
            return;
        }
        for (int i = 0; i < remaining.Count; i++)
        {
            int elem = remaining[i];
            current.Add(elem);
            remaining.RemoveAt(i);
            Backtrack(current, remaining, result);
            remaining.Insert(i, elem);
            current.RemoveAt(current.Count - 1);
        }
    }

    static void Main(string[] args)
    {
        var arr = new List<int> { 1, 2, 3 };
        var result = GetPermutations(arr);
        foreach (var perm in result)
        {
            Console.WriteLine("[" + string.Join(", ", perm) + "]");
        }
    }
}

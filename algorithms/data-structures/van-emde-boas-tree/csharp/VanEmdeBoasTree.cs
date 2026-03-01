using System;
using System.Collections.Generic;

public class VanEmdeBoasTree
{
    public static int[] VanEmdeBoasTreeOps(int[] data)
    {
        int u = data[0], nOps = data[1];
        var set = new SortedSet<int>();
        var results = new List<int>();
        int idx = 2;
        for (int i = 0; i < nOps; i++)
        {
            int op = data[idx], val = data[idx + 1];
            idx += 2;
            switch (op)
            {
                case 1:
                    set.Add(val);
                    break;
                case 2:
                    results.Add(set.Contains(val) ? 1 : 0);
                    break;
                case 3:
                    var view = set.GetViewBetween(val + 1, u - 1);
                    results.Add(view.Count > 0 ? view.Min : -1);
                    break;
            }
        }
        return results.ToArray();
    }

    public static void Main(string[] args)
    {
        Console.WriteLine(string.Join(", ", VanEmdeBoasTreeOps(new int[] { 16, 4, 1, 3, 1, 5, 2, 3, 2, 7 })));
        Console.WriteLine(string.Join(", ", VanEmdeBoasTreeOps(new int[] { 16, 6, 1, 1, 1, 4, 1, 9, 2, 4, 3, 4, 3, 9 })));
    }
}

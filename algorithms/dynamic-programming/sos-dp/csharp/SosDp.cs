using System;
using System.Linq;

class SosDp {
    public static int[] Solve(int n, int[] f) {
        int size = 1 << n;
        int[] sos = (int[])f.Clone();

        for (int i = 0; i < n; i++) {
            for (int mask = 0; mask < size; mask++) {
                if ((mask & (1 << i)) != 0) {
                    sos[mask] += sos[mask ^ (1 << i)];
                }
            }
        }
        return sos;
    }

    static void Main(string[] args) {
        int n = int.Parse(Console.ReadLine().Trim());
        int[] f = Console.ReadLine().Trim().Split(' ').Select(int.Parse).ToArray();
        int[] result = Solve(n, f);
        Console.WriteLine(string.Join(" ", result));
    }
}

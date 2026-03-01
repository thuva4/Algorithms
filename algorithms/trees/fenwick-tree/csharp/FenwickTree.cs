using System;

class FenwickTree
{
    private int[] tree;
    private int n;

    public FenwickTree(int[] arr)
    {
        n = arr.Length;
        tree = new int[n + 1];
        for (int i = 0; i < n; i++)
            Update(i, arr[i]);
    }

    public void Update(int i, int delta)
    {
        for (++i; i <= n; i += i & (-i))
            tree[i] += delta;
    }

    public int Query(int i)
    {
        int sum = 0;
        for (++i; i > 0; i -= i & (-i))
            sum += tree[i];
        return sum;
    }

    static void Main(string[] args)
    {
        int[] arr = { 1, 2, 3, 4, 5 };
        var ft = new FenwickTree(arr);
        Console.WriteLine("Sum of first 4 elements: " + ft.Query(3));

        ft.Update(2, 5);
        Console.WriteLine("After update, sum of first 4 elements: " + ft.Query(3));
    }
}

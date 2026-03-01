using System;

class SegmentTree
{
    private int[] tree;
    private int n;

    public SegmentTree(int[] arr)
    {
        n = arr.Length;
        tree = new int[4 * n];
        if (n > 0) Build(arr, 0, 0, n - 1);
    }

    private void Build(int[] arr, int node, int start, int end)
    {
        if (start == end)
        {
            tree[node] = arr[start];
        }
        else
        {
            int mid = (start + end) / 2;
            Build(arr, 2 * node + 1, start, mid);
            Build(arr, 2 * node + 2, mid + 1, end);
            tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
        }
    }

    public void Update(int idx, int val)
    {
        Update(0, 0, n - 1, idx, val);
    }

    private void Update(int node, int start, int end, int idx, int val)
    {
        if (start == end)
        {
            tree[node] = val;
        }
        else
        {
            int mid = (start + end) / 2;
            if (idx <= mid) Update(2 * node + 1, start, mid, idx, val);
            else Update(2 * node + 2, mid + 1, end, idx, val);
            tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
        }
    }

    public int Query(int l, int r)
    {
        return Query(0, 0, n - 1, l, r);
    }

    private int Query(int node, int start, int end, int l, int r)
    {
        if (r < start || end < l) return 0;
        if (l <= start && end <= r) return tree[node];
        int mid = (start + end) / 2;
        return Query(2 * node + 1, start, mid, l, r) +
               Query(2 * node + 2, mid + 1, end, l, r);
    }

    static void Main(string[] args)
    {
        int[] arr = { 1, 3, 5, 7, 9, 11 };
        var st = new SegmentTree(arr);
        Console.WriteLine("Sum [1, 3]: " + st.Query(1, 3));

        st.Update(1, 10);
        Console.WriteLine("After update, sum [1, 3]: " + st.Query(1, 3));
    }
}

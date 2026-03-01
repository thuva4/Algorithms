using System;

class UnionFind
{
    private int[] parent;
    private int[] rank;

    public UnionFind(int n)
    {
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
    }

    public int Find(int x)
    {
        if (parent[x] != x)
            parent[x] = Find(parent[x]);
        return parent[x];
    }

    public void Union(int x, int y)
    {
        int px = Find(x), py = Find(y);
        if (px == py) return;
        if (rank[px] < rank[py]) { int tmp = px; px = py; py = tmp; }
        parent[py] = px;
        if (rank[px] == rank[py]) rank[px]++;
    }

    public bool Connected(int x, int y)
    {
        return Find(x) == Find(y);
    }

    static void Main(string[] args)
    {
        var uf = new UnionFind(5);
        uf.Union(0, 1);
        uf.Union(1, 2);
        Console.WriteLine("0 and 2 connected: " + uf.Connected(0, 2));
        Console.WriteLine("0 and 3 connected: " + uf.Connected(0, 3));
    }
}

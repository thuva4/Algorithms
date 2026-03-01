using System.Collections.Generic;

public class BTree
{
    private const int T = 3;
    private const int MaxKeys = 2 * T - 1;

    private class Node
    {
        public List<int> Keys = new List<int>();
        public List<Node> Children = new List<Node>();
        public bool Leaf = true;
    }

    private static void SplitChild(Node parent, int i)
    {
        Node full = parent.Children[i];
        Node newNode = new Node { Leaf = full.Leaf };
        int mid = T - 1;
        for (int j = T; j < full.Keys.Count; j++)
            newNode.Keys.Add(full.Keys[j]);
        int median = full.Keys[mid];
        if (!full.Leaf)
        {
            for (int j = T; j < full.Children.Count; j++)
                newNode.Children.Add(full.Children[j]);
            full.Children.RemoveRange(T, full.Children.Count - T);
        }
        full.Keys.RemoveRange(mid, full.Keys.Count - mid);
        parent.Keys.Insert(i, median);
        parent.Children.Insert(i + 1, newNode);
    }

    private static void InsertNonFull(Node node, int key)
    {
        if (node.Leaf)
        {
            int pos = node.Keys.FindIndex(k => k > key);
            if (pos == -1) pos = node.Keys.Count;
            node.Keys.Insert(pos, key);
        }
        else
        {
            int i = node.Keys.Count - 1;
            while (i >= 0 && key < node.Keys[i]) i--;
            i++;
            if (node.Children[i].Keys.Count == MaxKeys)
            {
                SplitChild(node, i);
                if (key > node.Keys[i]) i++;
            }
            InsertNonFull(node.Children[i], key);
        }
    }

    private static void Inorder(Node node, List<int> result)
    {
        if (node == null) return;
        for (int i = 0; i < node.Keys.Count; i++)
        {
            if (!node.Leaf) Inorder(node.Children[i], result);
            result.Add(node.Keys[i]);
        }
        if (!node.Leaf) Inorder(node.Children[node.Keys.Count], result);
    }

    public static int[] Run(int[] arr)
    {
        if (arr.Length == 0) return new int[0];
        Node root = new Node();
        foreach (int v in arr)
        {
            if (root.Keys.Count == MaxKeys)
            {
                Node newRoot = new Node { Leaf = false };
                newRoot.Children.Add(root);
                SplitChild(newRoot, 0);
                root = newRoot;
            }
            InsertNonFull(root, v);
        }
        List<int> result = new List<int>();
        Inorder(root, result);
        return result.ToArray();
    }
}

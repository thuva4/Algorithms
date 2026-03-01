using System;
using System.Collections.Generic;

public class Treap
{
    private static Random rng = new Random(42);

    private class TNode
    {
        public int Key, Priority;
        public TNode Left, Right;
        public TNode(int key) { Key = key; Priority = rng.Next(); }
    }

    private static TNode RightRot(TNode p)
    {
        TNode q = p.Left;
        p.Left = q.Right;
        q.Right = p;
        return q;
    }

    private static TNode LeftRot(TNode p)
    {
        TNode q = p.Right;
        p.Right = q.Left;
        q.Left = p;
        return q;
    }

    private static TNode InsertNode(TNode root, int key)
    {
        if (root == null) return new TNode(key);
        if (key < root.Key)
        {
            root.Left = InsertNode(root.Left, key);
            if (root.Left.Priority > root.Priority) root = RightRot(root);
        }
        else if (key > root.Key)
        {
            root.Right = InsertNode(root.Right, key);
            if (root.Right.Priority > root.Priority) root = LeftRot(root);
        }
        return root;
    }

    private static void Inorder(TNode node, List<int> result)
    {
        if (node == null) return;
        Inorder(node.Left, result);
        result.Add(node.Key);
        Inorder(node.Right, result);
    }

    public static int[] Run(int[] arr)
    {
        TNode root = null;
        foreach (int v in arr) root = InsertNode(root, v);
        List<int> result = new List<int>();
        Inorder(root, result);
        return result.ToArray();
    }
}

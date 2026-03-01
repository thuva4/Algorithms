using System;
using System.Collections.Generic;

public class AvlTree
{
    private class Node
    {
        public int Key;
        public Node Left, Right;
        public int Height;
        public Node(int key) { Key = key; Height = 1; }
    }

    private static int Height(Node node) => node?.Height ?? 0;

    private static void UpdateHeight(Node node)
    {
        node.Height = 1 + Math.Max(Height(node.Left), Height(node.Right));
    }

    private static int BalanceFactor(Node node) => Height(node.Left) - Height(node.Right);

    private static Node RotateRight(Node y)
    {
        Node x = y.Left;
        Node t2 = x.Right;
        x.Right = y;
        y.Left = t2;
        UpdateHeight(y);
        UpdateHeight(x);
        return x;
    }

    private static Node RotateLeft(Node x)
    {
        Node y = x.Right;
        Node t2 = y.Left;
        y.Left = x;
        x.Right = t2;
        UpdateHeight(x);
        UpdateHeight(y);
        return y;
    }

    private static Node Insert(Node node, int key)
    {
        if (node == null) return new Node(key);
        if (key < node.Key) node.Left = Insert(node.Left, key);
        else if (key > node.Key) node.Right = Insert(node.Right, key);
        else return node;

        UpdateHeight(node);
        int bf = BalanceFactor(node);

        if (bf > 1 && key < node.Left.Key) return RotateRight(node);
        if (bf < -1 && key > node.Right.Key) return RotateLeft(node);
        if (bf > 1 && key > node.Left.Key)
        {
            node.Left = RotateLeft(node.Left);
            return RotateRight(node);
        }
        if (bf < -1 && key < node.Right.Key)
        {
            node.Right = RotateRight(node.Right);
            return RotateLeft(node);
        }

        return node;
    }

    private static void Inorder(Node node, List<int> result)
    {
        if (node == null) return;
        Inorder(node.Left, result);
        result.Add(node.Key);
        Inorder(node.Right, result);
    }

    public static int[] AvlInsertInorder(int[] arr)
    {
        Node root = null;
        foreach (int val in arr)
            root = Insert(root, val);
        var result = new List<int>();
        Inorder(root, result);
        return result.ToArray();
    }
}

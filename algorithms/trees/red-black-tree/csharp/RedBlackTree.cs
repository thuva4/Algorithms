using System.Collections.Generic;

public class RedBlackTree
{
    private class Node
    {
        public int Key;
        public Node Left, Right, Parent;
        public bool IsRed;
        public Node(int key) { Key = key; IsRed = true; }
    }

    private static Node root;

    private static void RotateLeft(Node x)
    {
        Node y = x.Right;
        x.Right = y.Left;
        if (y.Left != null) y.Left.Parent = x;
        y.Parent = x.Parent;
        if (x.Parent == null) root = y;
        else if (x == x.Parent.Left) x.Parent.Left = y;
        else x.Parent.Right = y;
        y.Left = x;
        x.Parent = y;
    }

    private static void RotateRight(Node x)
    {
        Node y = x.Left;
        x.Left = y.Right;
        if (y.Right != null) y.Right.Parent = x;
        y.Parent = x.Parent;
        if (x.Parent == null) root = y;
        else if (x == x.Parent.Right) x.Parent.Right = y;
        else x.Parent.Left = y;
        y.Right = x;
        x.Parent = y;
    }

    private static void FixInsert(Node z)
    {
        while (z.Parent != null && z.Parent.IsRed)
        {
            Node gp = z.Parent.Parent;
            if (z.Parent == gp.Left)
            {
                Node y = gp.Right;
                if (y != null && y.IsRed)
                {
                    z.Parent.IsRed = false;
                    y.IsRed = false;
                    gp.IsRed = true;
                    z = gp;
                }
                else
                {
                    if (z == z.Parent.Right) { z = z.Parent; RotateLeft(z); }
                    z.Parent.IsRed = false;
                    z.Parent.Parent.IsRed = true;
                    RotateRight(z.Parent.Parent);
                }
            }
            else
            {
                Node y = gp.Left;
                if (y != null && y.IsRed)
                {
                    z.Parent.IsRed = false;
                    y.IsRed = false;
                    gp.IsRed = true;
                    z = gp;
                }
                else
                {
                    if (z == z.Parent.Left) { z = z.Parent; RotateRight(z); }
                    z.Parent.IsRed = false;
                    z.Parent.Parent.IsRed = true;
                    RotateLeft(z.Parent.Parent);
                }
            }
        }
        root.IsRed = false;
    }

    private static void Insert(int key)
    {
        Node y = null, x = root;
        while (x != null)
        {
            y = x;
            if (key < x.Key) x = x.Left;
            else if (key > x.Key) x = x.Right;
            else return;
        }
        Node node = new Node(key) { Parent = y };
        if (y == null) root = node;
        else if (key < y.Key) y.Left = node;
        else y.Right = node;
        FixInsert(node);
    }

    private static void Inorder(Node node, List<int> result)
    {
        if (node == null) return;
        Inorder(node.Left, result);
        result.Add(node.Key);
        Inorder(node.Right, result);
    }

    public static int[] RbInsertInorder(int[] arr)
    {
        root = null;
        foreach (int val in arr) Insert(val);
        var result = new List<int>();
        Inorder(root, result);
        return result.ToArray();
    }
}

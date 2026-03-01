using System;
using System.Collections.Generic;

public class BinarySearchTree
{
    private class Node
    {
        public int Key;
        public Node Left;
        public Node Right;

        public Node(int key)
        {
            Key = key;
        }
    }

    private static Node Insert(Node root, int key)
    {
        if (root == null)
        {
            return new Node(key);
        }
        if (key <= root.Key)
        {
            root.Left = Insert(root.Left, key);
        }
        else
        {
            root.Right = Insert(root.Right, key);
        }
        return root;
    }

    private static void Inorder(Node root, List<int> result)
    {
        if (root == null) return;
        Inorder(root.Left, result);
        result.Add(root.Key);
        Inorder(root.Right, result);
    }

    public static int[] BstInorder(int[] arr)
    {
        Node root = null;
        foreach (int key in arr)
        {
            root = Insert(root, key);
        }

        List<int> result = new List<int>();
        Inorder(root, result);
        return result.ToArray();
    }
}

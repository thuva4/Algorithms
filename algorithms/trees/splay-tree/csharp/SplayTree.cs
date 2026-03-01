using System.Collections.Generic;

public class SplayTree
{
    private class SNode
    {
        public int Key;
        public SNode Left, Right;
        public SNode(int key) { Key = key; }
    }

    private static SNode RightRotate(SNode x)
    {
        SNode y = x.Left;
        x.Left = y.Right;
        y.Right = x;
        return y;
    }

    private static SNode LeftRotate(SNode x)
    {
        SNode y = x.Right;
        x.Right = y.Left;
        y.Left = x;
        return y;
    }

    private static SNode SplayOp(SNode root, int key)
    {
        if (root == null || root.Key == key) return root;
        if (key < root.Key)
        {
            if (root.Left == null) return root;
            if (key < root.Left.Key)
            {
                root.Left.Left = SplayOp(root.Left.Left, key);
                root = RightRotate(root);
            }
            else if (key > root.Left.Key)
            {
                root.Left.Right = SplayOp(root.Left.Right, key);
                if (root.Left.Right != null) root.Left = LeftRotate(root.Left);
            }
            return root.Left == null ? root : RightRotate(root);
        }
        else
        {
            if (root.Right == null) return root;
            if (key > root.Right.Key)
            {
                root.Right.Right = SplayOp(root.Right.Right, key);
                root = LeftRotate(root);
            }
            else if (key < root.Right.Key)
            {
                root.Right.Left = SplayOp(root.Right.Left, key);
                if (root.Right.Left != null) root.Right = RightRotate(root.Right);
            }
            return root.Right == null ? root : LeftRotate(root);
        }
    }

    private static SNode InsertNode(SNode root, int key)
    {
        if (root == null) return new SNode(key);
        root = SplayOp(root, key);
        if (root.Key == key) return root;
        SNode node = new SNode(key);
        if (key < root.Key)
        {
            node.Right = root;
            node.Left = root.Left;
            root.Left = null;
        }
        else
        {
            node.Left = root;
            node.Right = root.Right;
            root.Right = null;
        }
        return node;
    }

    private static void Inorder(SNode node, List<int> result)
    {
        if (node == null) return;
        Inorder(node.Left, result);
        result.Add(node.Key);
        Inorder(node.Right, result);
    }

    public static int[] Run(int[] arr)
    {
        SNode root = null;
        foreach (int v in arr) root = InsertNode(root, v);
        List<int> result = new List<int>();
        Inorder(root, result);
        return result.ToArray();
    }
}

using System;
using System.Collections.Generic;

class TreeNode
{
    public int Val;
    public TreeNode Left, Right;
    public TreeNode(int val) { Val = val; }
}

class BinaryTree
{
    static TreeNode BuildTree(int?[] arr)
    {
        if (arr.Length == 0 || arr[0] == null) return null;

        var root = new TreeNode(arr[0].Value);
        var queue = new Queue<TreeNode>();
        queue.Enqueue(root);
        int i = 1;

        while (queue.Count > 0 && i < arr.Length)
        {
            var node = queue.Dequeue();
            if (i < arr.Length && arr[i] != null)
            {
                node.Left = new TreeNode(arr[i].Value);
                queue.Enqueue(node.Left);
            }
            i++;
            if (i < arr.Length && arr[i] != null)
            {
                node.Right = new TreeNode(arr[i].Value);
                queue.Enqueue(node.Right);
            }
            i++;
        }
        return root;
    }

    static List<int> LevelOrderTraversal(int?[] arr)
    {
        var result = new List<int>();
        var root = BuildTree(arr);
        if (root == null) return result;

        var queue = new Queue<TreeNode>();
        queue.Enqueue(root);

        while (queue.Count > 0)
        {
            var node = queue.Dequeue();
            result.Add(node.Val);
            if (node.Left != null) queue.Enqueue(node.Left);
            if (node.Right != null) queue.Enqueue(node.Right);
        }
        return result;
    }

    static void Main(string[] args)
    {
        int?[] arr = { 1, 2, 3, 4, 5, 6, 7 };
        var result = LevelOrderTraversal(arr);
        Console.WriteLine("Level order: [" + string.Join(", ", result) + "]");
    }
}

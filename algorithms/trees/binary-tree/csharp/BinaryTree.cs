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

        var nodes = new TreeNode[arr.Length];
        for (int i = 0; i < arr.Length; i++)
        {
            if (arr[i] != null)
            {
                nodes[i] = new TreeNode(arr[i].Value);
            }
        }

        for (int i = 0; i < arr.Length; i++)
        {
            if (nodes[i] == null)
            {
                continue;
            }

            int leftIndex = (2 * i) + 1;
            int rightIndex = (2 * i) + 2;

            if (leftIndex < arr.Length)
            {
                nodes[i].Left = nodes[leftIndex];
            }
            if (rightIndex < arr.Length)
            {
                nodes[i].Right = nodes[rightIndex];
            }
        }

        return nodes[0];
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

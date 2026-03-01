using System;
using System.Collections.Generic;

public class SkipList
{
    private const int MaxLevel = 16;
    private static Random rng = new Random(42);

    private class SkipNode
    {
        public int Key;
        public SkipNode[] Forward;
        public SkipNode(int key, int level)
        {
            Key = key;
            Forward = new SkipNode[level + 1];
        }
    }

    public static int[] Run(int[] arr)
    {
        SkipNode header = new SkipNode(int.MinValue, MaxLevel);
        int level = 0;

        foreach (int val in arr)
        {
            SkipNode[] update = new SkipNode[MaxLevel + 1];
            SkipNode current = header;
            for (int i = level; i >= 0; i--)
            {
                while (current.Forward[i] != null && current.Forward[i].Key < val)
                    current = current.Forward[i];
                update[i] = current;
            }
            current = current.Forward[0];
            if (current != null && current.Key == val) continue;

            int newLevel = 0;
            while (rng.Next(2) == 1 && newLevel < MaxLevel) newLevel++;
            if (newLevel > level)
            {
                for (int i = level + 1; i <= newLevel; i++) update[i] = header;
                level = newLevel;
            }
            SkipNode newNode = new SkipNode(val, newLevel);
            for (int i = 0; i <= newLevel; i++)
            {
                newNode.Forward[i] = update[i].Forward[i];
                update[i].Forward[i] = newNode;
            }
        }

        List<int> result = new List<int>();
        SkipNode node = header.Forward[0];
        while (node != null)
        {
            result.Add(node.Key);
            node = node.Forward[0];
        }
        return result.ToArray();
    }
}

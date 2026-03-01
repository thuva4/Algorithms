using System;
using System.Collections.Generic;

public class Trie
{
    private class TrieNode
    {
        public Dictionary<char, TrieNode> Children = new Dictionary<char, TrieNode>();
        public bool IsEnd = false;
    }

    private static void Insert(TrieNode root, int key)
    {
        TrieNode node = root;
        foreach (char ch in key.ToString())
        {
            if (!node.Children.ContainsKey(ch))
            {
                node.Children[ch] = new TrieNode();
            }
            node = node.Children[ch];
        }
        node.IsEnd = true;
    }

    private static bool Search(TrieNode root, int key)
    {
        TrieNode node = root;
        foreach (char ch in key.ToString())
        {
            if (!node.Children.ContainsKey(ch))
            {
                return false;
            }
            node = node.Children[ch];
        }
        return node.IsEnd;
    }

    public static int InsertSearch(int[] arr)
    {
        int n = arr.Length;
        int mid = n / 2;
        TrieNode root = new TrieNode();

        for (int i = 0; i < mid; i++)
        {
            Insert(root, arr[i]);
        }

        int count = 0;
        for (int i = mid; i < n; i++)
        {
            if (Search(root, arr[i]))
            {
                count++;
            }
        }

        return count;
    }
}

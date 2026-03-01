using System.Collections.Generic;

public class LruCache
{
    private class Node
    {
        public int Key;
        public int Value;
        public Node Prev;
        public Node Next;

        public Node(int key, int value)
        {
            Key = key;
            Value = value;
        }
    }

    private readonly int _capacity;
    private readonly Dictionary<int, Node> _map;
    private readonly Node _head;
    private readonly Node _tail;

    private LruCache(int capacity)
    {
        _capacity = capacity;
        _map = new Dictionary<int, Node>();
        _head = new Node(0, 0);
        _tail = new Node(0, 0);
        _head.Next = _tail;
        _tail.Prev = _head;
    }

    private void RemoveNode(Node node)
    {
        node.Prev.Next = node.Next;
        node.Next.Prev = node.Prev;
    }

    private void AddToHead(Node node)
    {
        node.Next = _head.Next;
        node.Prev = _head;
        _head.Next.Prev = node;
        _head.Next = node;
    }

    private int Get(int key)
    {
        if (_map.TryGetValue(key, out Node node))
        {
            RemoveNode(node);
            AddToHead(node);
            return node.Value;
        }
        return -1;
    }

    private void Put(int key, int value)
    {
        if (_map.TryGetValue(key, out Node node))
        {
            node.Value = value;
            RemoveNode(node);
            AddToHead(node);
        }
        else
        {
            if (_map.Count == _capacity)
            {
                Node lru = _tail.Prev;
                RemoveNode(lru);
                _map.Remove(lru.Key);
            }
            Node newNode = new Node(key, value);
            _map[key] = newNode;
            AddToHead(newNode);
        }
    }

    public static int LruCacheOps(int[] operations)
    {
        int capacity = operations[0];
        int opCount = operations[1];
        LruCache cache = new LruCache(capacity);
        int resultSum = 0;
        int idx = 2;

        for (int i = 0; i < opCount; i++)
        {
            int opType = operations[idx];
            int key = operations[idx + 1];
            int value = operations[idx + 2];
            idx += 3;

            if (opType == 1)
            {
                cache.Put(key, value);
            }
            else if (opType == 2)
            {
                resultSum += cache.Get(key);
            }
        }

        return resultSum;
    }
}

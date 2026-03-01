using System;
using System.Collections.Generic;

public class HashTable
{
    private const int TableSize = 64;

    private class Entry
    {
        public int Key;
        public int Value;

        public Entry(int key, int value)
        {
            Key = key;
            Value = value;
        }
    }

    private readonly List<Entry>[] _buckets;

    private HashTable()
    {
        _buckets = new List<Entry>[TableSize];
        for (int i = 0; i < TableSize; i++)
        {
            _buckets[i] = new List<Entry>();
        }
    }

    private int Hash(int key)
    {
        return Math.Abs(key) % TableSize;
    }

    private void Put(int key, int value)
    {
        int idx = Hash(key);
        foreach (var entry in _buckets[idx])
        {
            if (entry.Key == key)
            {
                entry.Value = value;
                return;
            }
        }
        _buckets[idx].Add(new Entry(key, value));
    }

    private int Get(int key)
    {
        int idx = Hash(key);
        foreach (var entry in _buckets[idx])
        {
            if (entry.Key == key)
            {
                return entry.Value;
            }
        }
        return -1;
    }

    private void Delete(int key)
    {
        int idx = Hash(key);
        _buckets[idx].RemoveAll(e => e.Key == key);
    }

    public static int HashTableOps(int[] operations)
    {
        HashTable table = new HashTable();
        int opCount = operations[0];
        int resultSum = 0;
        int idx = 1;

        for (int i = 0; i < opCount; i++)
        {
            int opType = operations[idx];
            int key = operations[idx + 1];
            int value = operations[idx + 2];
            idx += 3;

            switch (opType)
            {
                case 1:
                    table.Put(key, value);
                    break;
                case 2:
                    resultSum += table.Get(key);
                    break;
                case 3:
                    table.Delete(key);
                    break;
            }
        }

        return resultSum;
    }
}

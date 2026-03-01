using System;
using System.Collections.Generic;

class AhoCorasick
{
    private int[,] goTo;
    private int[] fail;
    private List<int>[] output;
    private string[] patterns;
    private int states;

    public AhoCorasick(string[] patterns)
    {
        this.patterns = patterns;
        int maxStates = 1;
        foreach (var p in patterns) maxStates += p.Length;

        goTo = new int[maxStates, 26];
        for (int i = 0; i < maxStates; i++)
            for (int j = 0; j < 26; j++)
                goTo[i, j] = -1;

        fail = new int[maxStates];
        output = new List<int>[maxStates];
        for (int i = 0; i < maxStates; i++)
            output[i] = new List<int>();

        states = 1;
        BuildTrie();
        BuildFailLinks();
    }

    private void BuildTrie()
    {
        for (int i = 0; i < patterns.Length; i++)
        {
            int cur = 0;
            foreach (char c in patterns[i])
            {
                int ch = c - 'a';
                if (goTo[cur, ch] == -1)
                    goTo[cur, ch] = states++;
                cur = goTo[cur, ch];
            }
            output[cur].Add(i);
        }
    }

    private void BuildFailLinks()
    {
        var queue = new Queue<int>();
        for (int c = 0; c < 26; c++)
        {
            if (goTo[0, c] != -1)
            {
                fail[goTo[0, c]] = 0;
                queue.Enqueue(goTo[0, c]);
            }
            else
            {
                goTo[0, c] = 0;
            }
        }

        while (queue.Count > 0)
        {
            int u = queue.Dequeue();
            for (int c = 0; c < 26; c++)
            {
                if (goTo[u, c] != -1)
                {
                    int v = goTo[u, c];
                    int f = fail[u];
                    while (f != 0 && goTo[f, c] == -1) f = fail[f];
                    fail[v] = (goTo[f, c] != -1 && goTo[f, c] != v) ? goTo[f, c] : 0;
                    output[v].AddRange(output[fail[v]]);
                    queue.Enqueue(v);
                }
            }
        }
    }

    public List<Tuple<string, int>> Search(string text)
    {
        var results = new List<Tuple<string, int>>();
        int cur = 0;
        for (int i = 0; i < text.Length; i++)
        {
            int c = text[i] - 'a';
            while (cur != 0 && goTo[cur, c] == -1) cur = fail[cur];
            if (goTo[cur, c] != -1) cur = goTo[cur, c];
            foreach (int idx in output[cur])
            {
                results.Add(Tuple.Create(patterns[idx], i - patterns[idx].Length + 1));
            }
        }
        return results;
    }

    static void Main(string[] args)
    {
        var ac = new AhoCorasick(new[] { "he", "she", "his", "hers" });
        var results = ac.Search("ahishers");
        foreach (var r in results)
        {
            Console.WriteLine($"Word \"{r.Item1}\" found at index {r.Item2}");
        }
    }
}

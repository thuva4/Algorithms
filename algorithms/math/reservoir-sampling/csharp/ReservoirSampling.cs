using System;

public class ReservoirSampling
{
    public static int[] Sample(int[] stream, int k, int seed)
    {
        int n = stream.Length;

        if (k >= n)
        {
            return (int[])stream.Clone();
        }

        int[] reservoir = new int[k];
        Array.Copy(stream, reservoir, k);

        Random rng = new Random(seed);
        for (int i = k; i < n; i++)
        {
            int j = rng.Next(i + 1);
            if (j < k)
            {
                reservoir[j] = stream[i];
            }
        }

        return reservoir;
    }
}

using System;

public class SimulatedAnnealing
{
    public static int Solve(int[] arr)
    {
        if (arr.Length == 0) return 0;
        if (arr.Length == 1) return arr[0];

        int n = arr.Length;
        Random rng = new Random(42);

        int current = 0;
        int best = 0;
        double temperature = 1000.0;
        double coolingRate = 0.995;
        double minTemp = 0.01;

        while (temperature > minTemp)
        {
            int neighbor = rng.Next(n);
            int delta = arr[neighbor] - arr[current];

            if (delta < 0)
            {
                current = neighbor;
            }
            else
            {
                double probability = Math.Exp(-delta / temperature);
                if (rng.NextDouble() < probability)
                {
                    current = neighbor;
                }
            }

            if (arr[current] < arr[best])
            {
                best = current;
            }

            temperature *= coolingRate;
        }

        return arr[best];
    }
}

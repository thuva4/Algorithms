using System;

class HammingDistance
{
    static int ComputeHammingDistance(int a, int b)
    {
        int xor = a ^ b;
        int distance = 0;
        while (xor != 0)
        {
            distance += xor & 1;
            xor >>= 1;
        }
        return distance;
    }

    static void Main(string[] args)
    {
        Console.WriteLine("Hamming distance between 1 and 4: " + ComputeHammingDistance(1, 4));
        Console.WriteLine("Hamming distance between 7 and 8: " + ComputeHammingDistance(7, 8));
        Console.WriteLine("Hamming distance between 93 and 73: " + ComputeHammingDistance(93, 73));
    }
}

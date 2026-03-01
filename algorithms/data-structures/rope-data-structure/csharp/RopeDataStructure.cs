using System;

public class RopeDataStructure
{
    public static int Rope(int[] data)
    {
        int n1 = data[0];
        int pos = 1 + n1;
        int n2 = data[pos];
        int queryIndex = data[pos + 1 + n2];

        if (queryIndex < n1)
            return data[1 + queryIndex];
        else
            return data[pos + 1 + queryIndex - n1];
    }

    public static void Main(string[] args)
    {
        Console.WriteLine(Rope(new int[] { 3, 1, 2, 3, 2, 4, 5, 0 }));
        Console.WriteLine(Rope(new int[] { 3, 1, 2, 3, 2, 4, 5, 4 }));
        Console.WriteLine(Rope(new int[] { 3, 1, 2, 3, 2, 4, 5, 3 }));
    }
}

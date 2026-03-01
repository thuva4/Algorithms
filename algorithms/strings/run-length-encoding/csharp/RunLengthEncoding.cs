using System.Collections.Generic;

public class RunLengthEncoding
{
    public static int[] Run(int[] arr)
    {
        if (arr.Length == 0) return new int[0];
        List<int> result = new List<int>();
        int count = 1;
        for (int i = 1; i < arr.Length; i++)
        {
            if (arr[i] == arr[i-1]) count++;
            else { result.Add(arr[i-1]); result.Add(count); count = 1; }
        }
        result.Add(arr[arr.Length-1]); result.Add(count);
        return result.ToArray();
    }
}

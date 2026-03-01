using System.Collections.Generic;

public class TreeTraversals
{
    private static void Inorder(int[] arr, int i, List<int> result)
    {
        if (i >= arr.Length || arr[i] == -1) return;
        Inorder(arr, 2 * i + 1, result);
        result.Add(arr[i]);
        Inorder(arr, 2 * i + 2, result);
    }

    public static int[] Run(int[] arr)
    {
        List<int> result = new List<int>();
        Inorder(arr, 0, result);
        return result.ToArray();
    }
}

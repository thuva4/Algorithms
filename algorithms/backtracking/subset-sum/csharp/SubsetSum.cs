public class SubsetSum
{
    public static int SubsetSumSolve(int[] arr, int target)
    {
        return Backtrack(arr, 0, target) ? 1 : 0;
    }

    private static bool Backtrack(int[] arr, int index, int remaining)
    {
        if (remaining == 0)
        {
            return true;
        }
        if (index >= arr.Length)
        {
            return false;
        }
        // Include arr[index]
        if (Backtrack(arr, index + 1, remaining - arr[index]))
        {
            return true;
        }
        // Exclude arr[index]
        if (Backtrack(arr, index + 1, remaining))
        {
            return true;
        }
        return false;
    }
}

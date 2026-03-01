using System;

class CountingInversions
{
    static int Merge(int[] arr, int[] temp, int left, int mid, int right)
    {
        int i = left, j = mid, k = left;
        int invCount = 0;

        while (i < mid && j <= right)
        {
            if (arr[i] <= arr[j])
                temp[k++] = arr[i++];
            else
            {
                temp[k++] = arr[j++];
                invCount += (mid - i);
            }
        }
        while (i < mid) temp[k++] = arr[i++];
        while (j <= right) temp[k++] = arr[j++];
        for (i = left; i <= right; i++) arr[i] = temp[i];

        return invCount;
    }

    static int MergeSortCount(int[] arr, int[] temp, int left, int right)
    {
        int invCount = 0;
        if (left < right)
        {
            int mid = (left + right) / 2;
            invCount += MergeSortCount(arr, temp, left, mid);
            invCount += MergeSortCount(arr, temp, mid + 1, right);
            invCount += Merge(arr, temp, left, mid + 1, right);
        }
        return invCount;
    }

    static int CountInversionsInArray(int[] arr)
    {
        int[] temp = new int[arr.Length];
        return MergeSortCount(arr, temp, 0, arr.Length - 1);
    }

    static void Main(string[] args)
    {
        int[] arr = { 2, 4, 1, 3, 5 };
        Console.WriteLine("Number of inversions: " + CountInversionsInArray(arr));
    }
}

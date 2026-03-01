namespace Algorithms.Sorting.SelectionSort
{
    public class SelectionSort
    {
        public static void Sort(int[] arr)
        {
            if (arr == null) return;
            
            int n = arr.Length;
            for (int i = 0; i < n - 1; i++)
            {
                int min_idx = i;
                for (int j = i + 1; j < n; j++)
                {
                    if (arr[j] < arr[min_idx])
                        min_idx = j;
                }

                int temp = arr[min_idx];
                arr[min_idx] = arr[i];
                arr[i] = temp;
            }
        }
    }
}

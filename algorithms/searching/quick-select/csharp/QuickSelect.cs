namespace Algorithms.Searching.QuickSelect
{
    public class QuickSelect
    {
        public static int Select(int[] arr, int k)
        {
            return KthSmallest(arr, 0, arr.Length - 1, k);
        }

        private static int KthSmallest(int[] arr, int l, int r, int k)
        {
            if (k > 0 && k <= r - l + 1)
            {
                int pos = Partition(arr, l, r);

                if (pos - l == k - 1)
                    return arr[pos];
                if (pos - l > k - 1)
                    return KthSmallest(arr, l, pos - 1, k);

                return KthSmallest(arr, pos + 1, r, k - pos + l - 1);
            }
            return -1;
        }

        private static int Partition(int[] arr, int l, int r)
        {
            int x = arr[r], i = l;
            for (int j = l; j <= r - 1; j++)
            {
                if (arr[j] <= x)
                {
                    int temp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = temp;
                    i++;
                }
            }
            int temp2 = arr[i];
            arr[i] = arr[r];
            arr[r] = temp2;
            return i;
        }
    }
}

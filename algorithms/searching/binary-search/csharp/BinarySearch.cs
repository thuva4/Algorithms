namespace Algorithms.Searching.BinarySearch
{
    public class BinarySearch
    {
        public static int Search(int[] arr, int target)
        {
            if (arr == null) return -1;
            
            int left = 0;
            int right = arr.Length - 1;

            while (left <= right)
            {
                int mid = left + (right - left) / 2;

                if (arr[mid] == target)
                    return mid;

                if (arr[mid] < target)
                    left = mid + 1;
                else
                    right = mid - 1;
            }

            return -1;
        }
    }
}

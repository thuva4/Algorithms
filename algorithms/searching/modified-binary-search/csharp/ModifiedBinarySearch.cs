namespace Algorithms.Searching.ModifiedBinarySearch
{
    public class ModifiedBinarySearch
    {
        public static int Search(int[] arr, int target)
        {
            if (arr == null || arr.Length == 0) return -1;
            
            int start = 0;
            int end = arr.Length - 1;
            
            bool isAscending = arr[start] <= arr[end];
            
            while (start <= end)
            {
                int mid = start + (end - start) / 2;
                
                if (arr[mid] == target)
                    return mid;
                    
                if (isAscending)
                {
                    if (target < arr[mid])
                        end = mid - 1;
                    else
                        start = mid + 1;
                }
                else
                {
                    if (target > arr[mid])
                        end = mid - 1;
                    else
                        start = mid + 1;
                }
            }
            return -1;
        }
    }
}

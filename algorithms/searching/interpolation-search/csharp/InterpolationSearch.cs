namespace Algorithms.Searching.InterpolationSearch
{
    public class InterpolationSearch
    {
        public static int Search(int[] arr, int target)
        {
            if (arr == null || arr.Length == 0) return -1;
            
            int lo = 0, hi = arr.Length - 1;

            while (lo <= hi && target >= arr[lo] && target <= arr[hi])
            {
                if (lo == hi)
                {
                    if (arr[lo] == target) return lo;
                    return -1;
                }
                
                if (arr[hi] == arr[lo])
                {
                     if (arr[lo] == target) return lo;
                     return -1;
                }

                int pos = lo + (int)(((double)(hi - lo) / (arr[hi] - arr[lo])) * (target - arr[lo]));

                if (arr[pos] == target)
                    return pos;

                if (arr[pos] < target)
                    lo = pos + 1;
                else
                    hi = pos - 1;
            }
            return -1;
        }
    }
}

namespace Algorithms.Searching.LinearSearch
{
    public class LinearSearch
    {
        public static int Search(int[] arr, int target)
        {
            if (arr == null) return -1;
            
            for (int i = 0; i < arr.Length; i++)
            {
                if (arr[i] == target)
                    return i;
            }
            return -1;
        }
    }
}

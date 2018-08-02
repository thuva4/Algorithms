using System;

public class BinarySearch
{
    // Returns index of the item if it is present in array, else returns -1
    public int Search(int[] array, int leftIndex, int rightIndex, int item)
    {
        if (rightIndex >= leftIndex)
        {
            int middleIndex = leftIndex + (rightIndex - leftIndex)/2;
 
            // If the item is present at the middle itself
            if (array[middleIndex] == item)
            {
               return middleIndex;
            }
 
            // If item is smaller than middle, then it can only be present in left subarray
            if (array[middleIndex] > item)
            {
               return Search(array, leftIndex, middleIndex - 1, item);
            }
 
            // Else the item can only be present in right subarray
            return Search(array, middleIndex + 1, rightIndex, item);
        }
 
        // If execution reach here then item is not present in array
        return -1;
    }    
}

public class Program
{
    // Test method
    public static int Main(string[] args)
    {
        var binarySearch = new BinarySearch();
        var array = new int[]{ 2, 3, 4, 10, 40 };        
        var item = 10;
        var result = binarySearch.Search(array, 0, array.Length - 1, item);
        if (result == -1)
        {
            Console.WriteLine("Item not present");
        }
        else
        {
            Console.WriteLine("Item found at index " + result);
        }

        return 0;
    }
}

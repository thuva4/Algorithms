using System;

public class LinearSearch
{
    // Returns index of the item if it is present in array, else returns -1
    public int Search(int[] array, int item)
    {
        for (int i = 0; i < array.Length; i++)
        {
            // Return the index of the item if the it is found
            if (array[i] == item)
            {
                return i;
            }
        }
  
        // return -1 if the item is not found
        return -1;
    }    
}

public class Program
{
    // Test method
    public static int Main(string[] args)
    {
        var linearSearch = new LinearSearch();
        var array = new int[]{ 2, 3, 4, 10, 40 };        
        var item = 10;
        var result = linearSearch.Search(array, item);
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


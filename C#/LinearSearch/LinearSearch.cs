using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace Solution
{
    class Solution
    {
        /// <summary>
        /// Function to find the first occurance of an integer in an array
        /// </summary>
        /// <param name="arr">The integer array to search</param>
        /// <param name="searchTerm">The integer to find</param>
        /// <returns>The index of the found item, otherwise -1</returns>
        static int LinearSearch(int[] arr, int searchTerm)
        {
            for (int i = 0; i < arr.Length; i++)
            {
                if (arr[i] == searchTerm)
                {
                    return i;
                }
            }
            return -1;
        }

        static void Main(string[] args)
        {
            int[] arr = { 1, 2, 3, -5, 7, 8, 9 };
            long index = LinearSearch(arr, 3);
            Console.WriteLine(index);
        }
    }
}

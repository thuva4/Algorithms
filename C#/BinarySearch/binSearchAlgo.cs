using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

namespace BinSearchAlgo
{
    public class Program
    {            
        // Returns index of searchValue in sorted array x, or -1 if not found
        public static int BinSearch(int[] x, int searchValue)
        {
            var low = 0;
            var high = x.Length - 1;
            return binarySearch(x, searchValue, low, high);
        }

        public static int binarySearch(int[] x, int searchValue, int low, int high)
        {
            if (high < low)
            {
                return -1;
            }
            var mid = (low + high) / 2;
            if (searchValue > x[mid])
            {
                return binarySearch(x, searchValue, mid + 1, high);
            }
            else if (searchValue < x[mid])
            {
                return binarySearch(x, searchValue, low, mid - 1);
            }
            else
            {
                return mid;
            }
        }
        
        //Setting up a random array and search value
        public static void Main(string[] args)
        {
            var rnd = new Random();
            
            var rndList = new List<int>();
            
            for(var i = 0; i < 10; i++)
            {
                var num = rnd.Next(0, 999);
                while (rndList.Contains(num))
                {
                    num = rnd.Next(0, 999);
                }
                rndList.Add(num);
            }
            
            rndList.Sort();
            
            Console.WriteLine(String.Join(",", rndList));
                        
            var arr = rndList.ToArray();

            var searchItem = arr[rnd.Next(0, 10)];
            Console.WriteLine("Search Item: " + searchItem);
            
            Console.WriteLine("Index:" + BinSearch(arr, searchItem));
            Console.WriteLine("Index:" + BinSearch(arr, 99999));
        }
    }
}
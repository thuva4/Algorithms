using System;

namespace BinarySearch
{
    class RecursiveBinarySearch
    {
        static int BinarySearch(int[] arr, int key, int b, int e){
            if(b > e)
                return -1;

            int m = (b + e)/2;

            if(arr[m] == key)
                return m;

            if(arr[m] > key) 
                return BinarySearch(arr, key, b, m - 1);
            else 
                return BinarySearch(arr, key, m + 1, e);
        }

        static void Main(string[] args)
        {
            int[] numbers = new int[10] { 1, 7, 25, 31, 42, 56, 61, 78, 83, 94 };
            int key;
            
            Console.WriteLine("Array elements:");
            for (int i = 0; i < numbers.Length; i++){
                Console.Write("Number: {0}", numbers[i]);
            }

            Console.Write("\nEnter a number to search: ");

            while (!int.TryParse(Console.ReadLine(), out key))
            {
                Console.Write("Please enter a valid number: ");
            }

            int result = BinarySearch(numbers, key, 0, numbers.Length);

            if( result == -1 ){
                Console.WriteLine("Number not found.");
            } else {
                Console.WriteLine("The number {0} is on index {1}", key, result);
            }             
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

namespace CSharpAlgorithms
{
    public class Program
    {
        public static void Main(string[] args)
        {
            int[] arr = { 1, 6, 2, 5, 4, 3 };
            QuickSort(arr, 0, 5); 
            arr.ToList().ForEach(i => Console.WriteLine(i.ToString()));
        }
        
        public static void QuickSort(int[] array, int left, int right)
        {
            if(left > right || left <0 || right <0) return; 
            int index = Partition(array, left, right);
            if (index != -1)
            {
                QuickSort(array, left, index - 1);
                QuickSort(array, index + 1, right);
            }
        }

        private static int Partition(int[] array, int left, int right)
        {
            if(left > right) return -1; 
            int end = left; 
            int pivot = array[right];    // choose last one to pivot, easy to code
            for(int i= left; i< right; i++)
            {
                if (array[i] < pivot)
                {
                    Swap(array, i, end);
                    end++; 
                }
            }
            Swap(array, end, right);
            return end; 
        }

        private static void Swap(int[] array, int left, int right)
        {
            int tmp = array[left];
            array[left] = array[right];
            array[right] = tmp; 
        }
    }
}

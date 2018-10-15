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
            int[] array={5,3,7,2};
            SelectionSort(array);            
            array.ToList().ForEach(i => Console.WriteLine(i.ToString()));
        }
        
        public static void SelectionSort(int[] array)
        {
            int n=array.Length;
            for(int x=0; x<n; x++)
            {
                int min_index=x;
                for(int y=x; y<n; y++)
                {
                    if(array[min_index]>array[y])
                    {
                        min_index=y;
                    }
                }
                int temp=array[x];
                array[x]=array[min_index];
                array[min_index]=temp;
            }
        }
    }
}

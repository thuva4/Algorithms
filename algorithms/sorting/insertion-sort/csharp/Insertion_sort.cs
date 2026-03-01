using System.IO;
using System;

class Program
{
    static void Main()
    {
        int[] arr= {3,4,5,1,6,7,8,2,0};
        insertionSort(arr);
        
        foreach (int x in arr) 
        {
            Console.WriteLine(x);
        }
    }
    
    static void insertionSort(int[] arr)
    {
        for(int j=1; j < arr.Length; j++) 
        {
            int key = arr[j];
            int i = j - 1;
            while (i >= 0 && arr[i]>key)
            {
                arr[i+1] = arr[i];
                i = i - 1;
            }
            arr[i+1] = key;
        }
        
    }
}

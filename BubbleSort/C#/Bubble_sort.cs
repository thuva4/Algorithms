using System.IO;
using System;

class Program
{
    public static void doBubbleSort(int[] array) {
        for (int i = 0; i < array.Length; i++) {
            bool sorted = true;
            //sorted remains true means the array is already sorted
            for (int j = 1; j < array.Length; j++) {
                if (array[j] < array[j - 1]) { 
                    int temp = array[j - 1];
                    array[j - 1] = array[j];
                    array[j] = temp;
                    sorted = false;
                }
            }
            if (sorted) break;
        }
    }
}

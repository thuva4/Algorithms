using System.IO;
using System;

class Program
{
    //By calling the sort method will sort the given array    
    static void sort(int[] a) {
        int[] helper = new int[a.Length];
        sort(a, 0, a.Length - 1, helper);

    }

    static void sort(int[] a, int low, int high, int[] helper) {
        if (low >= high) {
            return;
        }
        int middle = low + (high - low) / 2;
        sort(a, low, middle, helper);
        sort(a, middle + 1, high, helper);
        merge(a, low, middle, high, helper);
    }

    static void merge(int[] a, int low, int middle, int high, int[] helper) {
        for (int i = low; i <= high; i++) {
            helper[i] = a[i];
        }
        int x = low;
        int j = middle + 1;

        for (int k = low; k <= high; k++) {
            if (x > middle) {
                a[k] = helper[j++];
            } else if (j > high) {
                a[k] = helper[x++];
            } else if (helper[x] <= helper[j]) {
                a[k] = helper[x++];
            } else {
                a[k] = helper[j++];
            }
        }
    }
}

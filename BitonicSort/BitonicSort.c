/**
 * File: BitonicSort.c
 * Bitonic sort algorithm
 * Author: Nicktheway (NTW)
 * Made for Hactoberfest 2017 on 19/10/2017
 * Compile-command example: gcc -o Bitonic BitonicSort.c
 * Run-command example: ./Bitonic 15
 */

#include <stdio.h>
#include <stdlib.h> //For malloc, free, exit, atoi

//Globally accessed variables for the array and its size
double *array;
u_int N;

//Enumerator for selecting the direction of the sort.
enum Direction{
    ED_descending = 0,
    ED_ascending = 1
};

//Methods used.
void InitializeArray();
void Sort(enum Direction dir);
void BitonicSort(int startingIndex, int size, enum Direction dir);
void BitonicMerge(int startingIndex, int size, enum Direction dir);
void CompareAndSwap(int elementIndex, int elementLaterIndex, enum Direction dir);
int TestIfSorted(enum Direction dir);
void PrintArray(); //Uncomment in main() for use, should pipeline the output to a file for big arrays.

//Main()
int main(int argc, char **argv)
{
    //Check program's initial arguments
    if (argc != 2){
        printf("Usage:\n %s n\nwhere 2^n is the size of the array to be sorted.\n", argv[0]);
        return 1;
    }
    int n = atoi(argv[1]);
    if (n <= 0 || n > 31)
    {
        printf("Usage:\n %s n\nwhere 2^n is the size of the array to be sorted and must be a positive number (max n value: 31, max recommended value: 24)\n", argv[0]);
        return 1;
    }
    
    //Array size N = 2^(atoi(argv[1])) or 2^n:
    N = 1 << n;
    
    //Allocate memory for the array:
    array = (double *) malloc(N * sizeof(double));
    
    //Check if memory allocation failed:
    if (array == NULL)
    {
        printf("Couldn't allocate memory for the array, probably due to its size: 2^%d*%d bites = %u MB.\nPassing a smaller n will probably fix this error.\n", n, sizeof(double), N*sizeof(double) / (1024*1024*8));
    }
    
    //Change to ED_descending for a descending sort.
    enum Direction dir = ED_ascending;
    
    //Initialize the array.
    InitializeArray();
    
    //PrintArray(); //Uncomment for printing the initial array.
    
    //Sort the array.
    Sort(dir);
    
    //Sort Proof
    if (TestIfSorted(dir))
        printf("Array sorted successfully\n");
    else printf("Sorting FAILED\n");
    
    //PrintArray(); //Uncomment for printing the sorted array.
    
    //Free allocated memory
    free(array);
    
    //Indicate successive run of the program.
    return 0;
}

//Calls bitonic sort to sort the array according to the direction dir.
void Sort(enum Direction dir)
{
    BitonicSort(0, N, dir);
}

/**
 * This function produces a bitonic sequence by recursively sorting
 * its two halves in opposite sorting orders and then, calls BitonicMerge()
 * to merge all the halves in the same order.
 */
void BitonicSort(int startingIndex, int size, enum Direction dir)
{
    int halfSize = size / 2;
    if (halfSize < 1) return;
    
    BitonicSort(startingIndex, halfSize, ED_ascending);
    BitonicSort(startingIndex + halfSize, halfSize, ED_descending);
    
    BitonicMerge(startingIndex, size, dir);
}
/**
 * This function recursively sorts a bitonic sequence
 * in ascending or descending order according to dir.
 */
void BitonicMerge(int startingIndex, int size, enum Direction dir)
{
    int halfSize = size / 2;
    if (halfSize < 1) return;
    for (int i = startingIndex; i < startingIndex + halfSize; i++)
    {
        CompareAndSwap(i, i+halfSize, dir);
    }
    
    BitonicMerge(startingIndex, halfSize, dir);
    BitonicMerge(startingIndex + halfSize, halfSize, dir);
}

//Test for successful sorting
int TestIfSorted(enum Direction dir)
{
    switch(dir)
    {
        case ED_ascending:
            for (int i = 1; i < N; i++)
            {
                if (array[i - 1] > array[i]) return 0;
            }
            return 1;
        case ED_descending:
            for (int i = 1; i < N; i++)
            {
                if (array[i - 1] < array[i]) return 0;
            }
            return 1;
    }
    return 0;
}
/**
 * Initialize array with random numbers
 */
void InitializeArray()
{
    for (int i = 0; i < N; i++)
    {
        array[i] = (double)(rand() % N);
    }
}

void PrintArray()
{
    for (int i = 0; i < N; i++)
    {
        printf("%lf\n", array[i]);
    }
}
/**
 * This function compare the values of two array indexes and 
 * swaps them if they don't agree with the direction dir.
 * (dir equals 0 or 1 according to the enum defined at the beggining of the file)
 */
inline void CompareAndSwap(int elementIndex, int elementLaterIndex, enum Direction dir)
{
    if (dir == (array[elementIndex] > array[elementLaterIndex]))
    {
        int t = array[elementIndex];
        array[elementIndex] = array[elementLaterIndex];
        array[elementLaterIndex] = t;
    }
}

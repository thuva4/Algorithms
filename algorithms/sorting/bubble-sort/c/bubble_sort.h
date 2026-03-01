#ifndef BUBBLE_SORT_H
#define BUBBLE_SORT_H

/**
 * Bubble Sort implementation.
 * Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.
 * Includes the 'swapped' flag optimization to terminate early if the array is already sorted.
 * @param arr the input array (modified in-place)
 * @param n the number of elements in the array
 */
void bubble_sort(int arr[], int n);

#endif

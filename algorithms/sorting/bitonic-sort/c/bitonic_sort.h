#ifndef BITONIC_SORT_H
#define BITONIC_SORT_H

/**
 * Bitonic Sort implementation.
 * Works on any array size by padding to the nearest power of 2.
 * @param arr the input array (modified in-place)
 * @param n the number of elements in the array
 */
int* bitonic_sort(const int *arr, int n);

#endif

#ifndef PIGEONHOLE_SORT_H
#define PIGEONHOLE_SORT_H

/**
 * Pigeonhole Sort implementation.
 * Efficient for sorting lists of integers where the number of elements is roughly the same as the number of possible key values.
 * @param arr the input array (modified in-place)
 * @param n the number of elements in the array
 */
void pigeonhole_sort(int arr[], int n);

#endif

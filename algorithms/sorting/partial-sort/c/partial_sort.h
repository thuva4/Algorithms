#ifndef PARTIAL_SORT_H
#define PARTIAL_SORT_H

/**
 * Partial Sort implementation.
 * Returns the smallest k elements of the array in sorted order.
 * The result is stored in the first k elements of the 'result' array.
 * The caller is responsible for ensuring 'result' has enough space.
 * @param arr the input array
 * @param n the number of elements in the array
 * @param k the number of smallest elements to return
 * @param result the output array to store the k smallest elements
 */
void partial_sort(const int arr[], int n, int k, int result[]);

#endif

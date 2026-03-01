#ifndef GNOME_SORT_H
#define GNOME_SORT_H

/**
 * Gnome Sort implementation.
 * A sorting algorithm which is similar to insertion sort in that it works with one item at a time
 * but gets the item to the proper place by a series of swaps, similar to a bubble sort.
 * @param arr the input array (modified in-place)
 * @param n the number of elements in the array
 */
void gnome_sort(int arr[], int n);

#endif

#ifndef HUNGARIAN_ALGORITHM_H
#define HUNGARIAN_ALGORITHM_H

/**
 * Solve the assignment problem using the Hungarian algorithm in O(n^3).
 *
 * @param n         Size of the cost matrix (n x n)
 * @param cost      Flattened n x n cost matrix (row-major)
 * @param assignment Output array of size n; assignment[i] = job for worker i
 * @return          The minimum total cost
 */
int hungarian_impl(int n, const int* cost, int* assignment);
char *hungarian(int arr[], int size);

#endif /* HUNGARIAN_ALGORITHM_H */

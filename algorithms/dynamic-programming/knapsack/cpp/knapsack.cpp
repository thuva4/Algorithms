// - Question :
// Given a set of items, each with a weight and a value, determine the number of
// each item to include in a collection so that the total weight is less than or
// equal to a given limit and the total value is as large as possible.
// - Example :
// There are n = 3 items, the maximum weight is 5, here is the list of items :
// Weight 4  2 3
// Value  10 4 7
// If we take the two last items, the total weight is 5 and the max value is 11.

#include <iostream>

using namespace std;

// Dynamic programming (with memoization) approach
int knapsackDp(const int *weights, const int *values, int n, int maxWeight, int **data);

// Recursive approach
int knapsackRec(const int *weights, const int *values, int n, int maxWeight);

// Returns the max total value we can get with
// the total weight <= maxWeight
// There are n weights and values
int knapsack(const int *weights, const int *values, int n, int maxWeight) {
    // data[i][j] = max value with maxWeight i and the first j + 1 items
    // Initialize it with -1
    int **data = new int*[maxWeight];
    for (int i = 0; i < maxWeight; ++i) {
        data[i] = new int[n];
        for (int j = 0; j < n; ++j)
            data[i][j] = -1;
    }

    int result = knapsackDp(weights, values, n, maxWeight, data);

    for (int i = 0; i < maxWeight; ++i)
        delete[] data[i];
    delete[] data;

    return result;
}

int knapsackDp(const int *weights, const int *values, int n, int maxWeight, int **data) {
    if (n == 0 || maxWeight == 0)
        return 0;

    // This value is already computed
    if (data[maxWeight - 1][n - 1] != -1)
        return data[maxWeight - 1][n - 1];

    // We don't take the value at pos n - 1
    int without = knapsackDp(weights, values, n - 1, maxWeight, data);

    // We can't take the value at pos n - 1
    if (weights[n - 1] > maxWeight)
        return without;

    // We take the value
    int with = knapsackDp(weights, values, n - 1, maxWeight - weights[n - 1], data) + values[n - 1];

    int maxVal = with > without ? with : without;

    data[maxWeight - 1][n - 1] = maxVal;

    return maxVal;
}

int knapsackRec(const int *weights, const int *values, int n, int maxWeight) {
    if (n == 0 || maxWeight == 0)
        return 0;

    // We don't take the value at pos n - 1
    int without = knapsackRec(weights, values, n - 1, maxWeight);

    // We can't take the value at pos n - 1
    if (weights[n - 1] > maxWeight)
        return without;

    // We take the value
    int with = knapsackRec(weights, values, n - 1, maxWeight - weights[n - 1]) + values[n - 1];

    return with > without ? with : without;
}

int main() {
    int weights[] = {4, 2, 3};
    int values[] = {10, 4, 7};
    int maxWeight = 5;

    cout << knapsack(weights, values, sizeof(weights) / sizeof(int), maxWeight) << endl;

    return 0;
}


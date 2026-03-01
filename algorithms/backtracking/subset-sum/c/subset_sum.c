static int backtrack(int arr[], int n, int index, int remaining) {
    if (remaining == 0) {
        return 1;
    }
    if (index >= n) {
        return 0;
    }
    /* Include arr[index] */
    if (backtrack(arr, n, index + 1, remaining - arr[index])) {
        return 1;
    }
    /* Exclude arr[index] */
    if (backtrack(arr, n, index + 1, remaining)) {
        return 1;
    }
    return 0;
}

int subset_sum(int arr[], int n, int target) {
    return backtrack(arr, n, 0, target);
}

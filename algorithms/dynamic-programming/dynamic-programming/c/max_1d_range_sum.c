int max_1d_range_sum(int arr[], int n) {
    int best = 0;
    int current = 0;

    for (int i = 0; i < n; i++) {
        current += arr[i];
        if (current < 0) {
            current = 0;
        }
        if (current > best) {
            best = current;
        }
    }

    return best;
}

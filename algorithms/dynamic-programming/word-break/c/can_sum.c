#include <stdio.h>

/**
 * Determine if target can be formed by summing elements from arr
 * with repetition allowed.
 *
 * arr: array of positive integers (available elements)
 * num_elems: number of elements in arr
 * target: the target sum to reach
 * Returns: 1 if target is achievable, 0 otherwise
 */
int can_sum(int arr[], int num_elems, int target) {
    if (target == 0) return 1;

    int dp[target + 1];
    int i, j;

    dp[0] = 1;
    for (i = 1; i <= target; i++)
        dp[i] = 0;

    for (i = 1; i <= target; i++) {
        for (j = 0; j < num_elems; j++) {
            if (arr[j] <= i && dp[i - arr[j]]) {
                dp[i] = 1;
                break;
            }
        }
    }

    return dp[target];
}

int main() {
    int a1[] = {2, 3};
    printf("%d\n", can_sum(a1, 2, 7));   /* 1 */

    int a2[] = {5, 3};
    printf("%d\n", can_sum(a2, 2, 8));   /* 1 */

    int a3[] = {2, 4};
    printf("%d\n", can_sum(a3, 2, 7));   /* 0 */

    int a4[] = {1};
    printf("%d\n", can_sum(a4, 1, 5));   /* 1 */

    int a5[] = {7};
    printf("%d\n", can_sum(a5, 1, 3));   /* 0 */

    return 0;
}

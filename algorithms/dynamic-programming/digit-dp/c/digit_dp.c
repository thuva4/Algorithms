#include <stdio.h>
#include <string.h>
#include "digit_dp.h"

static int digits_arr[12];
static int num_digits;
static int target;
static int memo[12][110][2];

static int solve(int pos, int current_sum, int tight) {
    if (current_sum > target) return 0;
    if (pos == num_digits) {
        return current_sum == target ? 1 : 0;
    }
    if (memo[pos][current_sum][tight] != -1) {
        return memo[pos][current_sum][tight];
    }

    int limit = tight ? digits_arr[pos] : 9;
    int result = 0;
    for (int d = 0; d <= limit; d++) {
        result += solve(pos + 1, current_sum + d, tight && (d == limit));
    }

    memo[pos][current_sum][tight] = result;
    return result;
}

int digit_dp(int n, int target_sum) {
    if (n <= 0) return 0;
    target = target_sum;

    num_digits = 0;
    int temp = n;
    int buf[12];
    while (temp > 0) {
        buf[num_digits++] = temp % 10;
        temp /= 10;
    }
    for (int i = 0; i < num_digits; i++) {
        digits_arr[i] = buf[num_digits - 1 - i];
    }

    memset(memo, -1, sizeof(memo));
    int result = solve(0, 0, 1);
    if (target_sum == 0) {
        // The DP includes 0 via the all-leading-zero path; the contract is 1..N.
        result--;
    }
    return result;
}

int main(void) {
    int n, ts;
    scanf("%d %d", &n, &ts);
    printf("%d\n", digit_dp(n, ts));
    return 0;
}

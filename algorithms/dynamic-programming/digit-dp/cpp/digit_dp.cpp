#include <cstring>
#include <string>

namespace {
int digits[12];
int digit_count;
int target_sum;
int memo[12][110][2];

int solve(int position, int current_sum, int tight) {
    if (current_sum > target_sum) {
        return 0;
    }
    if (position == digit_count) {
        return current_sum == target_sum ? 1 : 0;
    }
    if (memo[position][current_sum][tight] != -1) {
        return memo[position][current_sum][tight];
    }

    int limit = tight ? digits[position] : 9;
    int count = 0;
    for (int digit = 0; digit <= limit; ++digit) {
        count += solve(position + 1, current_sum + digit, tight && digit == limit);
    }
    memo[position][current_sum][tight] = count;
    return count;
}
}  // namespace

int digit_dp(int n, int target) {
    if (n <= 0 || target < 0) {
        return 0;
    }

    target_sum = target;
    std::string value = std::to_string(n);
    digit_count = static_cast<int>(value.size());
    for (int index = 0; index < digit_count; ++index) {
        digits[index] = value[index] - '0';
    }

    std::memset(memo, -1, sizeof(memo));
    int count = solve(0, 0, 1);
    if (target == 0) {
        count -= 1;  // Exclude zero because the tests count from 1..N.
    }
    return count;
}

def digit_dp(n, target_sum):
    """Count numbers from 1 to n whose digit sum equals target_sum."""
    if n <= 0:
        return 0

    digits = []
    temp = n
    while temp > 0:
        digits.append(temp % 10)
        temp //= 10
    digits.reverse()

    num_digits = len(digits)
    # memo[pos][current_sum][tight]
    memo = {}

    def solve(pos, current_sum, tight):
        if current_sum > target_sum:
            return 0
        if pos == num_digits:
            return 1 if current_sum == target_sum else 0

        state = (pos, current_sum, tight)
        if state in memo:
            return memo[state]

        limit = digits[pos] if tight else 9
        result = 0
        for d in range(0, limit + 1):
            result += solve(pos + 1, current_sum + d, tight and (d == limit))

        memo[state] = result
        return result

    # Count from 0 to n, subtract count for 0 (digit sum 0)
    count = solve(0, 0, True)
    if target_sum == 0:
        count -= 1
    return count


if __name__ == "__main__":
    import sys
    data = sys.stdin.read().split()
    n = int(data[0])
    target = int(data[1])
    print(digit_dp(n, target))

using System;

class DigitDp {
    static int[] digits;
    static int numDigits;
    static int targetSum;
    static int[,,] memo;

    static int Solve(int pos, int currentSum, int tight) {
        if (currentSum > targetSum) return 0;
        if (pos == numDigits) {
            return currentSum == targetSum ? 1 : 0;
        }
        if (memo[pos, currentSum, tight] != -1) {
            return memo[pos, currentSum, tight];
        }

        int limit = tight == 1 ? digits[pos] : 9;
        int result = 0;
        for (int d = 0; d <= limit; d++) {
            int newTight = (tight == 1 && d == limit) ? 1 : 0;
            result += Solve(pos + 1, currentSum + d, newTight);
        }

        memo[pos, currentSum, tight] = result;
        return result;
    }

    static int CountDigitDp(int n, int target) {
        if (n <= 0) return 0;
        targetSum = target;

        string s = n.ToString();
        numDigits = s.Length;
        digits = new int[numDigits];
        for (int i = 0; i < numDigits; i++) {
            digits[i] = s[i] - '0';
        }

        int maxSum = 9 * numDigits;
        if (target > maxSum) return 0;

        memo = new int[numDigits, maxSum + 1, 2];
        for (int i = 0; i < numDigits; i++)
            for (int j = 0; j <= maxSum; j++)
                for (int k = 0; k < 2; k++)
                    memo[i, j, k] = -1;

        int count = Solve(0, 0, 1);
        if (target == 0) {
            count--;
        }
        return count;
    }

    static void Main(string[] args) {
        string[] parts = Console.ReadLine().Trim().Split(' ');
        int n = int.Parse(parts[0]);
        int target = int.Parse(parts[1]);
        Console.WriteLine(CountDigitDp(n, target));
    }
}

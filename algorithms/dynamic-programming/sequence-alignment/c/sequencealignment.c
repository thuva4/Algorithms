#include <stdio.h>
#include <string.h>

#define GAP_COST 4
#define MISMATCH_COST 3

int min(int a, int b, int c) {
    int m = a;
    if (b < m) m = b;
    if (c < m) m = c;
    return m;
}

int sequence_alignment(const char *s1, const char *s2) {
    int m = strlen(s1);
    int n = strlen(s2);

    int dp[m + 1][n + 1];

    for (int i = 0; i <= m; i++)
        dp[i][0] = i * GAP_COST;
    for (int j = 0; j <= n; j++)
        dp[0][j] = j * GAP_COST;

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            int match_cost = (s1[i - 1] == s2[j - 1]) ? 0 : MISMATCH_COST;
            dp[i][j] = min(
                dp[i - 1][j - 1] + match_cost,
                dp[i - 1][j] + GAP_COST,
                dp[i][j - 1] + GAP_COST
            );
        }
    }

    return dp[m][n];
}

int main() {
    printf("%d\n", sequence_alignment("GCCCTAGCG", "GCGCAATG")); // 18
    return 0;
}

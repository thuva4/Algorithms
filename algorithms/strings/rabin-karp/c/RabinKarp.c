#include <stdio.h>
#include <string.h>

#define PRIME 101
#define BASE 256

int rabinKarpSearch(const char *text, const char *pattern) {
    int n = strlen(text);
    int m = strlen(pattern);

    if (m == 0) return 0;
    if (m > n) return -1;

    long long patHash = 0;
    long long txtHash = 0;
    long long h = 1;
    int i, j;

    for (i = 0; i < m - 1; i++) {
        h = (h * BASE) % PRIME;
    }

    for (i = 0; i < m; i++) {
        patHash = (BASE * patHash + pattern[i]) % PRIME;
        txtHash = (BASE * txtHash + text[i]) % PRIME;
    }

    for (i = 0; i <= n - m; i++) {
        if (patHash == txtHash) {
            for (j = 0; j < m; j++) {
                if (text[i + j] != pattern[j]) break;
            }
            if (j == m) return i;
        }
        if (i < n - m) {
            txtHash = (BASE * (txtHash - text[i] * h) + text[i + m]) % PRIME;
            if (txtHash < 0) txtHash += PRIME;
        }
    }
    return -1;
}

int main() {
    const char *text = "ABABDABACDABABCABAB";
    const char *pattern = "ABABCABAB";
    printf("Pattern found at index: %d\n", rabinKarpSearch(text, pattern));
    return 0;
}

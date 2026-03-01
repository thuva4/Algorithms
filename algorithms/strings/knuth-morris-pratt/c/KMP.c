#include <stdio.h>
#include <string.h>
#include <stdlib.h>

void computeLPS(const char *pattern, int m, int *lps) {
    int len = 0;
    int i = 1;
    lps[0] = 0;

    while (i < m) {
        if (pattern[i] == pattern[len]) {
            len++;
            lps[i] = len;
            i++;
        } else {
            if (len != 0) {
                len = lps[len - 1];
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }
}

int kmpSearch(const char *text, const char *pattern) {
    int n = strlen(text);
    int m = strlen(pattern);

    if (m == 0) return 0;

    int *lps = (int *)malloc(m * sizeof(int));
    computeLPS(pattern, m, lps);

    int i = 0;
    int j = 0;
    while (i < n) {
        if (pattern[j] == text[i]) {
            i++;
            j++;
        }
        if (j == m) {
            free(lps);
            return i - j;
        } else if (i < n && pattern[j] != text[i]) {
            if (j != 0) {
                j = lps[j - 1];
            } else {
                i++;
            }
        }
    }

    free(lps);
    return -1;
}

int main() {
    const char *text = "ABABDABACDABABCABAB";
    const char *pattern = "ABABCABAB";
    int result = kmpSearch(text, pattern);
    printf("Pattern found at index: %d\n", result);
    return 0;
}

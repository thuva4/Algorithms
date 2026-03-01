#include <string.h>

int bitap_search(const char *text, const char *pattern) {
    size_t n = strlen(text);
    size_t m = strlen(pattern);

    if (m == 0) return 0;
    if (m > n) return -1;

    for (size_t i = 0; i + m <= n; i++) {
        if (strncmp(text + i, pattern, m) == 0) {
            return (int)i;
        }
    }

    return -1;
}

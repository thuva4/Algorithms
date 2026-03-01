#include <stddef.h>
#include <string.h>

char *tokenize(const char *string, const char *delimiter) {
    static char output[100000];
    size_t delim_len = strlen(delimiter);
    const char *cursor = string;
    int first = 1;

    output[0] = '\0';
    if (delim_len == 0) {
        if (string[0] != '\0') {
            strcpy(output, string);
        }
        return output;
    }

    while (*cursor != '\0') {
        const char *match = strstr(cursor, delimiter);
        size_t len = match ? (size_t)(match - cursor) : strlen(cursor);
        if (len > 0) {
            if (!first) {
                strcat(output, " ");
            }
            strncat(output, cursor, len);
            first = 0;
        }
        if (!match) {
            break;
        }
        cursor = match + delim_len;
    }

    return output;
}

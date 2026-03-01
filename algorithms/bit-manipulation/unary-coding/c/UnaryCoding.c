#include <stdio.h>
#include <string.h>

void unaryEncode(int n, char *result) {
    int i;
    for (i = 0; i < n; i++) {
        result[i] = '1';
    }
    result[n] = '0';
    result[n + 1] = '\0';
}

int main() {
    char result[100];

    unaryEncode(0, result);
    printf("Unary encoding of 0: %s\n", result);

    unaryEncode(3, result);
    printf("Unary encoding of 3: %s\n", result);

    unaryEncode(5, result);
    printf("Unary encoding of 5: %s\n", result);

    return 0;
}

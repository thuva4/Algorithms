#include <ctype.h>
#include <string.h>

int luhn_check(const char *number_string) {
    int sum = 0;
    int double_digit = 0;
    size_t len = strlen(number_string);

    for (size_t i = len; i > 0; i--) {
        char ch = number_string[i - 1];
        if (!isdigit((unsigned char)ch)) {
            return 0;
        }
        int digit = ch - '0';
        if (double_digit) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
        double_digit = !double_digit;
    }

    return (sum % 10) == 0;
}

#include <cctype>
#include <string>

bool luhn_check(const std::string& number) {
    int sum = 0;
    bool double_digit = false;

    for (int index = static_cast<int>(number.size()) - 1; index >= 0; --index) {
        unsigned char ch = static_cast<unsigned char>(number[index]);
        if (!std::isdigit(ch)) {
            return false;
        }

        int digit = number[index] - '0';
        if (double_digit) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        double_digit = !double_digit;
    }

    return sum % 10 == 0;
}

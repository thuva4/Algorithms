#include <string>

std::string day_of_week(int year, int month, int day) {
    static const int offsets[] = {0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4};
    static const char* names[] = {
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    };
    year -= month < 3 ? 1 : 0;
    int index = (year + year / 4 - year / 100 + year / 400 + offsets[month - 1] + day) % 7;
    return names[index];
}

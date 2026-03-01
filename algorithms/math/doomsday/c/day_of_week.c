char *day_of_week(int year, int month, int day) {
    static char *names[] = {
        "Sunday", "Monday", "Tuesday", "Wednesday",
        "Thursday", "Friday", "Saturday"
    };
    static int offsets[] = {0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4};
    int y = year;
    if (month < 3) {
        y--;
    }
    int index = (y + y / 4 - y / 100 + y / 400 + offsets[month - 1] + day) % 7;
    return names[index];
}

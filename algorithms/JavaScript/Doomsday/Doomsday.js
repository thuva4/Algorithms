
/**
 * Determines the day of the week using Tomohiko Sakamoto's Algorithm
 * to calculate Day of Week based on Gregorian calendar.
 */
function dow(y, m, d) {
    let t = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];
    y -= (m < 3) ? 1 : 0;
    return Math.round(y + y / 4 - y / 100 + y / 400 + t[m - 1] + d) % 7;
}

/**
 * Determines the day of the week using Tomohiko Sakamoto's Algorithm
 * to calculate Day of Week based on Gregorian calendar.
 */
function dowS(y, m, d) {
    switch (dow(y, m, d)) {
        case 0:
            return "Sunday";
        case 1:
            return "Monday";
        case 2:
            return "Tuesday";
        case 3:
            return "Wednesday";
        case 4:
            return "Thursday";
        case 5:
            return "Friday";
        case 6:
            return "Saturday";
        default:
            console.log("Unknown dow");
    }
    return null;
}

module.exports = { dow, dowS};

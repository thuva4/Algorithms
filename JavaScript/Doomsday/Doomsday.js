
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

console.log(dow(1886, 5, 1) + ": " + dowS(1886, 5, 1));       // 6: Saturday
console.log(dow(1948, 12, 10) + ": " + dowS(1948, 12, 10));   // 5: Friday
console.log(dow(2001, 1, 15) + ": " + dowS(2001, 1, 15));     // 1: Monday
console.log(dow(2017, 10, 10) + ": " + dowS(2017, 10, 10));   // 2: Tuesday
console.log(dow(2018, 1, 1) + ": " + dowS(2018, 1, 1));       // 1: Monday
console.log(dow(2018, 2, 16) + ": " + dowS(2018, 2, 16));     // 5: Friday
console.log(dow(2018, 5, 17) + ": " + dowS(2018, 5, 17));     // 4: Thursday
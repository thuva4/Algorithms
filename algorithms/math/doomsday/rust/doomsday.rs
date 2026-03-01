pub fn day_of_week(year: i32, month: i32, day: i32) -> String {
    let offsets = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];
    let mut y = year;
    if month < 3 {
        y -= 1;
    }

    let index = (y + y / 4 - y / 100 + y / 400 + offsets[(month - 1) as usize] + day) % 7;
    let names = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    names[index as usize].to_string()
}

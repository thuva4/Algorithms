package main

func dayOfWeek(y, m, d int) int {
	t := []int{0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4}
	if m < 3 {
		y--
	}
	return (y + y/4 - y/100 + y/400 + t[m-1] + d) % 7
}

func DayOfWeek(y, m, d int) string {
	switch dayOfWeek(y, m, d) {
	case 0:
		return "Sunday"
	case 1:
		return "Monday"
	case 2:
		return "Tuesday"
	case 3:
		return "Wednesday"
	case 4:
		return "Thursday"
	case 5:
		return "Friday"
	case 6:
		return "Saturday"
	default:
		return "Doomsday"
	}
}

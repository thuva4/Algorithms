package main

import "fmt"

func dayOfWeek(y, m, d int) int {
	t := []int{0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4}
	if m < 3 {
		y--
	}
	return (y + y/4 - y/100 + y/400 + t[m-1] + d) % 7
}

func printDay(y, m, d int) {
	switch dayOfWeek(y, m, d) {
	case 0:
		fmt.Println("Sunday")
		break
	case 1:
		fmt.Println("Monday")
		break
	case 2:
		fmt.Println("Tuesday")
		break
	case 3:
		fmt.Println("Wednesday")
		break
	case 4:
		fmt.Println("Thursday")
		break
	case 5:
		fmt.Println("Friday")
		break
	case 6:
		fmt.Println("Saturday")
		break
	default:
		fmt.Println("Doomsday")
		break
	}
}

func main() {
	printDay(1970, 1, 1)
	printDay(1111, 11, 11)
	printDay(2000, 1, 1)
}

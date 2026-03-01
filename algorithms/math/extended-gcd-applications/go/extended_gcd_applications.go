package main

import "fmt"

func extGcd(a, b int64) (int64, int64, int64) {
	if a == 0 { return b, 0, 1 }
	g, x1, y1 := extGcd(b%a, a)
	return g, y1 - (b/a)*x1, x1
}

func ExtendedGcdApplications(arr []int) int {
	a, m := int64(arr[0]), int64(arr[1])
	g, x, _ := extGcd(((a%m)+m)%m, m)
	if g != 1 { return -1 }
	return int(((x%m)+m)%m)
}

func main() {
	fmt.Println(ExtendedGcdApplications([]int{3, 7}))
	fmt.Println(ExtendedGcdApplications([]int{1, 13}))
	fmt.Println(ExtendedGcdApplications([]int{6, 9}))
	fmt.Println(ExtendedGcdApplications([]int{2, 11}))
}

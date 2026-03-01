package karatsuba

import (
	"fmt"
	"math"
)

func multiply(x, y int64) int64 {
	if x < 10 || y < 10 {
		return x * y
	}

	nx := len(fmt.Sprintf("%d", x))
	ny := len(fmt.Sprintf("%d", y))
	n := nx
	if ny > n {
		n = ny
	}
	half := n / 2
	power := int64(math.Pow(10, float64(half)))

	x1, x0 := x/power, x%power
	y1, y0 := y/power, y%power

	z0 := multiply(x0, y0)
	z2 := multiply(x1, y1)
	z1 := multiply(x0+x1, y0+y1) - z0 - z2

	return z2*power*power + z1*power + z0
}

func Karatsuba(arr []int) int {
	return int(multiply(int64(arr[0]), int64(arr[1])))
}

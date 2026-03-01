package newtonsmethod

func IntegerSqrt(arr []int) int {
	n := arr[0]
	if n <= 1 {
		return n
	}
	x := n
	for {
		x1 := (x + n/x) / 2
		if x1 >= x {
			return x
		}
		x = x1
	}
}

package zalgorithm

func ZFunction(arr []int) []int {
	n := len(arr)
	z := make([]int, n)
	l, r := 0, 0
	for i := 1; i < n; i++ {
		if i < r {
			z[i] = r - i
			if z[i-l] < z[i] {
				z[i] = z[i-l]
			}
		}
		for i+z[i] < n && arr[z[i]] == arr[i+z[i]] {
			z[i]++
		}
		if i+z[i] > r {
			l = i
			r = i + z[i]
		}
	}
	return z
}

package josephusproblem

func josephus(n, k int) int {
	if n <= 0 || k <= 0 {
		return 0
	}

	survivor := 0
	for size := 2; size <= n; size++ {
		survivor = (survivor + k) % size
	}

	return survivor
}

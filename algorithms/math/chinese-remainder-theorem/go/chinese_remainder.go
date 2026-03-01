package chineseremaindertheorem

func extGcd(a, b int64) (int64, int64, int64) {
	if a == 0 {
		return b, 0, 1
	}
	g, x1, y1 := extGcd(b%a, a)
	return g, y1 - (b/a)*x1, x1
}

func ChineseRemainder(arr []int) int {
	n := arr[0]
	r := int64(arr[1])
	m := int64(arr[2])

	for i := 1; i < n; i++ {
		r2 := int64(arr[1+2*i])
		m2 := int64(arr[2+2*i])
		g, p, _ := extGcd(m, m2)
		lcm := m / g * m2
		r = (r + m*((r2-r)/g)*p) % lcm
		if r < 0 {
			r += lcm
		}
		m = lcm
	}

	return int(r % m)
}

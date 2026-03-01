package pointinpolygon

func PointInPolygon(arr []int) int {
	px, py := arr[0], arr[1]
	n := arr[2]

	inside := false
	j := n - 1
	for i := 0; i < n; i++ {
		xi, yi := arr[3+2*i], arr[3+2*i+1]
		xj, yj := arr[3+2*j], arr[3+2*j+1]

		if (yi > py) != (yj > py) &&
			float64(px) < float64(xj-xi)*float64(py-yi)/float64(yj-yi)+float64(xi) {
			inside = !inside
		}
		j = i
	}

	if inside {
		return 1
	}
	return 0
}

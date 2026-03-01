package planaritytesting

func PlanarityTesting(arr []int) int {
	n := arr[0]; m := arr[1]
	type edge struct{ a, b int }
	edges := make(map[edge]bool)
	for i := 0; i < m; i++ {
		u, v := arr[2+2*i], arr[2+2*i+1]
		if u != v {
			a, b := u, v
			if a > b { a, b = b, a }
			edges[edge{a, b}] = true
		}
	}
	e := len(edges)
	if n < 3 { return 1 }
	if e <= 3*n-6 { return 1 }
	return 0
}

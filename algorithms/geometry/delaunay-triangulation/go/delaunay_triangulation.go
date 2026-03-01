package delaunaytriangulation

import "sort"

type point struct {
	x int
	y int
}

func cross(o, a, b point) int {
	return (a.x-o.x)*(b.y-o.y) - (a.y-o.y)*(b.x-o.x)
}

func DelaunayTriangulation(arr []int) int {
	n := arr[0]
	if n < 3 {
		return 0
	}

	points := make([]point, n)
	for i := 0; i < n; i++ {
		points[i] = point{x: arr[1+2*i], y: arr[1+2*i+1]}
	}

	sort.Slice(points, func(i, j int) bool {
		if points[i].x == points[j].x {
			return points[i].y < points[j].y
		}
		return points[i].x < points[j].x
	})

	lower := make([]point, 0, n)
	for _, p := range points {
		for len(lower) >= 2 && cross(lower[len(lower)-2], lower[len(lower)-1], p) <= 0 {
			lower = lower[:len(lower)-1]
		}
		lower = append(lower, p)
	}

	upper := make([]point, 0, n)
	for i := n - 1; i >= 0; i-- {
		p := points[i]
		for len(upper) >= 2 && cross(upper[len(upper)-2], upper[len(upper)-1], p) <= 0 {
			upper = upper[:len(upper)-1]
		}
		upper = append(upper, p)
	}

	hullSize := len(lower) + len(upper) - 2
	if hullSize < 3 {
		return 0
	}
	return 2*n - 2 - hullSize
}

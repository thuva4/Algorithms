package convexhull

import "sort"

type point struct{ x, y int }

func cross(o, a, b point) int64 {
	return int64(a.x-o.x)*int64(b.y-o.y) - int64(a.y-o.y)*int64(b.x-o.x)
}

// ConvexHullCount returns the number of points on the convex hull.
func ConvexHullCount(arr []int) int {
	n := arr[0]
	if n <= 2 { return n }

	points := make([]point, n)
	idx := 1
	for i := 0; i < n; i++ {
		points[i] = point{arr[idx], arr[idx+1]}
		idx += 2
	}
	sort.Slice(points, func(i, j int) bool {
		if points[i].x != points[j].x { return points[i].x < points[j].x }
		return points[i].y < points[j].y
	})

	hull := make([]point, 0, 2*n)
	for _, p := range points {
		for len(hull) >= 2 && cross(hull[len(hull)-2], hull[len(hull)-1], p) <= 0 { hull = hull[:len(hull)-1] }
		hull = append(hull, p)
	}
	lower := len(hull) + 1
	for i := n - 2; i >= 0; i-- {
		for len(hull) >= lower && cross(hull[len(hull)-2], hull[len(hull)-1], points[i]) <= 0 { hull = hull[:len(hull)-1] }
		hull = append(hull, points[i])
	}
	return len(hull) - 1
}

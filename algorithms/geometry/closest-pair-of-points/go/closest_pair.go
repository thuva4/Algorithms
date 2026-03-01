package closestpair

import (
	"math"
	"sort"
)

type point struct {
	x, y int
}

func distSq(a, b point) int {
	return (a.x-b.x)*(a.x-b.x) + (a.y-b.y)*(a.y-b.y)
}

func solve(pts []point, l, r int) int {
	if r-l < 3 {
		mn := math.MaxInt64
		for i := l; i <= r; i++ {
			for j := i + 1; j <= r; j++ {
				d := distSq(pts[i], pts[j])
				if d < mn {
					mn = d
				}
			}
		}
		return mn
	}

	mid := (l + r) / 2
	midX := pts[mid].x

	dl := solve(pts, l, mid)
	dr := solve(pts, mid+1, r)
	d := dl
	if dr < d {
		d = dr
	}

	var strip []point
	for i := l; i <= r; i++ {
		if (pts[i].x-midX)*(pts[i].x-midX) < d {
			strip = append(strip, pts[i])
		}
	}
	sort.Slice(strip, func(i, j int) bool {
		return strip[i].y < strip[j].y
	})

	for i := 0; i < len(strip); i++ {
		for j := i + 1; j < len(strip) &&
			(strip[j].y-strip[i].y)*(strip[j].y-strip[i].y) < d; j++ {
			dd := distSq(strip[i], strip[j])
			if dd < d {
				d = dd
			}
		}
	}

	return d
}

func ClosestPair(arr []int) int {
	n := len(arr) / 2
	points := make([]point, n)
	for i := 0; i < n; i++ {
		points[i] = point{arr[2*i], arr[2*i+1]}
	}
	sort.Slice(points, func(i, j int) bool {
		if points[i].x != points[j].x {
			return points[i].x < points[j].x
		}
		return points[i].y < points[j].y
	})
	return solve(points, 0, n-1)
}

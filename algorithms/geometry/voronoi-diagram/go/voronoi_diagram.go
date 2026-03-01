package voronoidiagram

import "math"

type vertex struct {
	x, y int64
}

func VoronoiDiagram(arr []int) int {
	n := arr[0]
	if n < 3 {
		return 0
	}

	px := make([]float64, n)
	py := make([]float64, n)
	for i := 0; i < n; i++ {
		px[i] = float64(arr[1+2*i])
		py[i] = float64(arr[1+2*i+1])
	}

	EPS := 1e-9
	vertices := make(map[vertex]bool)

	for i := 0; i < n; i++ {
		for j := i + 1; j < n; j++ {
			for k := j + 1; k < n; k++ {
				ax, ay := px[i], py[i]
				bx, by := px[j], py[j]
				cx, cy := px[k], py[k]

				d := 2.0 * (ax*(by-cy) + bx*(cy-ay) + cx*(ay-by))
				if math.Abs(d) < EPS {
					continue
				}

				ux := ((ax*ax+ay*ay)*(by-cy) + (bx*bx+by*by)*(cy-ay) + (cx*cx+cy*cy)*(ay-by)) / d
				uy := ((ax*ax+ay*ay)*(cx-bx) + (bx*bx+by*by)*(ax-cx) + (cx*cx+cy*cy)*(bx-ax)) / d

				rSq := (ux-ax)*(ux-ax) + (uy-ay)*(uy-ay)

				valid := true
				for m := 0; m < n; m++ {
					if m == i || m == j || m == k {
						continue
					}
					distSq := (ux-px[m])*(ux-px[m]) + (uy-py[m])*(uy-py[m])
					if distSq < rSq-EPS {
						valid = false
						break
					}
				}

				if valid {
					rx := int64(math.Round(ux * 1000000))
					ry := int64(math.Round(uy * 1000000))
					vertices[vertex{rx, ry}] = true
				}
			}
		}
	}

	return len(vertices)
}

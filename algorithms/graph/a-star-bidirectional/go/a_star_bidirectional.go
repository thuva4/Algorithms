package astarbidirectional

import (
	"container/heap"
	"math"
)

type Node struct {
	r, c int
	f, g int
	index int
}

type PriorityQueue []*Node

func (pq PriorityQueue) Len() int { return len(pq) }
func (pq PriorityQueue) Less(i, j int) bool {
	return pq[i].f < pq[j].f
}
func (pq PriorityQueue) Swap(i, j int) {
	pq[i], pq[j] = pq[j], pq[i]
	pq[i].index = i
	pq[j].index = j
}
func (pq *PriorityQueue) Push(x interface{}) {
	n := len(*pq)
	item := x.(*Node)
	item.index = n
	*pq = append(*pq, item)
}
func (pq *PriorityQueue) Pop() interface{} {
	old := *pq
	n := len(old)
	item := old[n-1]
	old[n-1] = nil
	item.index = -1
	*pq = old[0 : n-1]
	return item
}

func AStarBidirectional(arr []int) int {
	if len(arr) < 7 {
		return -1
	}

	rows := arr[0]
	cols := arr[1]
	sr, sc := arr[2], arr[3]
	er, ec := arr[4], arr[5]
	numObs := arr[6]

	if len(arr) < 7+2*numObs {
		return -1
	}

	if sr < 0 || sr >= rows || sc < 0 || sc >= cols || er < 0 || er >= rows || ec < 0 || ec >= cols {
		return -1
	}
	if sr == er && sc == ec {
		return 0
	}

	grid := make([]bool, rows*cols)
	for i := 0; i < numObs; i++ {
		r := arr[7+2*i]
		c := arr[7+2*i+1]
		if r >= 0 && r < rows && c >= 0 && c < cols {
			grid[r*cols+c] = true
		}
	}

	if grid[sr*cols+sc] || grid[er*cols+ec] {
		return -1
	}

	openF := &PriorityQueue{}
	heap.Init(openF)
	openB := &PriorityQueue{}
	heap.Init(openB)

	gF := make([]int, rows*cols)
	gB := make([]int, rows*cols)
	for i := range gF {
		gF[i] = math.MaxInt32
		gB[i] = math.MaxInt32
	}

	hStart := abs(sr-er) + abs(sc-ec)
	gF[sr*cols+sc] = 0
	heap.Push(openF, &Node{r: sr, c: sc, f: hStart, g: 0})

	hEnd := abs(er-sr) + abs(ec-sc)
	gB[er*cols+ec] = 0
	heap.Push(openB, &Node{r: er, c: ec, f: hEnd, g: 0})

	bestPath := math.MaxInt32
	dr := []int{-1, 1, 0, 0}
	dc := []int{0, 0, -1, 1}

	for openF.Len() > 0 && openB.Len() > 0 {
		// Forward
		if openF.Len() > 0 {
			u := heap.Pop(openF).(*Node)
			if u.g <= gF[u.r*cols+u.c] {
				for i := 0; i < 4; i++ {
					nr, nc := u.r+dr[i], u.c+dc[i]
					if nr >= 0 && nr < rows && nc >= 0 && nc < cols && !grid[nr*cols+nc] {
						newG := u.g + 1
						if newG < gF[nr*cols+nc] {
							gF[nr*cols+nc] = newG
							h := abs(nr-er) + abs(nc-ec)
							heap.Push(openF, &Node{r: nr, c: nc, f: newG + h, g: newG})

							if gB[nr*cols+nc] != math.MaxInt32 {
								if newG+gB[nr*cols+nc] < bestPath {
									bestPath = newG + gB[nr*cols+nc]
								}
							}
						}
					}
				}
			}
		}

		// Backward
		if openB.Len() > 0 {
			u := heap.Pop(openB).(*Node)
			if u.g <= gB[u.r*cols+u.c] {
				for i := 0; i < 4; i++ {
					nr, nc := u.r+dr[i], u.c+dc[i]
					if nr >= 0 && nr < rows && nc >= 0 && nc < cols && !grid[nr*cols+nc] {
						newG := u.g + 1
						if newG < gB[nr*cols+nc] {
							gB[nr*cols+nc] = newG
							h := abs(nr-sr) + abs(nc-sc)
							heap.Push(openB, &Node{r: nr, c: nc, f: newG + h, g: newG})

							if gF[nr*cols+nc] != math.MaxInt32 {
								if newG+gF[nr*cols+nc] < bestPath {
									bestPath = newG + gF[nr*cols+nc]
								}
							}
						}
					}
				}
			}
		}

		minF := math.MaxInt32
		if openF.Len() > 0 {
			minF = (*openF)[0].f
		}
		minB := math.MaxInt32
		if openB.Len() > 0 {
			minB = (*openB)[0].f
		}

		if bestPath != math.MaxInt32 && minF+minB >= bestPath {
			break
		}
	}

	if bestPath == math.MaxInt32 {
		return -1
	}
	return bestPath
}

func abs(x int) int {
	if x < 0 {
		return -x
	}
	return x
}

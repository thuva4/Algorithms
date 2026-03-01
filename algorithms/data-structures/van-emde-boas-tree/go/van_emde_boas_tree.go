package main

import (
	"fmt"
	"math"
)

type VEB struct {
	u, minVal, maxVal, sqrtU int
	cluster                  []*VEB
	summary                  *VEB
}

func newVEB(u int) *VEB {
	v := &VEB{u: u, minVal: -1, maxVal: -1}
	if u > 2 {
		v.sqrtU = int(math.Ceil(math.Sqrt(float64(u))))
		v.cluster = make([]*VEB, v.sqrtU)
		for i := 0; i < v.sqrtU; i++ {
			v.cluster[i] = newVEB(v.sqrtU)
		}
		v.summary = newVEB(v.sqrtU)
	}
	return v
}

func (v *VEB) high(x int) int { return x / v.sqrtU }
func (v *VEB) low(x int) int  { return x % v.sqrtU }
func (v *VEB) idx(h, l int) int { return h*v.sqrtU + l }

func (v *VEB) insert(x int) {
	if v.minVal == -1 {
		v.minVal = x
		v.maxVal = x
		return
	}
	if x < v.minVal {
		x, v.minVal = v.minVal, x
	}
	if v.u > 2 {
		h, l := v.high(x), v.low(x)
		if v.cluster[h].minVal == -1 {
			v.summary.insert(h)
		}
		v.cluster[h].insert(l)
	}
	if x > v.maxVal {
		v.maxVal = x
	}
}

func (v *VEB) member(x int) bool {
	if x == v.minVal || x == v.maxVal {
		return true
	}
	if v.u <= 2 {
		return false
	}
	return v.cluster[v.high(x)].member(v.low(x))
}

func (v *VEB) successor(x int) int {
	if v.u <= 2 {
		if x == 0 && v.maxVal == 1 {
			return 1
		}
		return -1
	}
	if v.minVal != -1 && x < v.minVal {
		return v.minVal
	}
	h, l := v.high(x), v.low(x)
	if v.cluster[h].minVal != -1 && l < v.cluster[h].maxVal {
		return v.idx(h, v.cluster[h].successor(l))
	}
	sc := v.summary.successor(h)
	if sc == -1 {
		return -1
	}
	return v.idx(sc, v.cluster[sc].minVal)
}

func vanEmdeBoasTree(data []int) []int {
	u := data[0]
	nOps := data[1]
	veb := newVEB(u)
	var results []int
	idx := 2
	for i := 0; i < nOps; i++ {
		op := data[idx]
		val := data[idx+1]
		idx += 2
		switch op {
		case 1:
			veb.insert(val)
		case 2:
			if veb.member(val) {
				results = append(results, 1)
			} else {
				results = append(results, 0)
			}
		case 3:
			results = append(results, veb.successor(val))
		}
	}
	return results
}

func main() {
	fmt.Println(vanEmdeBoasTree([]int{16, 4, 1, 3, 1, 5, 2, 3, 2, 7}))
	fmt.Println(vanEmdeBoasTree([]int{16, 6, 1, 1, 1, 4, 1, 9, 2, 4, 3, 4, 3, 9}))
}

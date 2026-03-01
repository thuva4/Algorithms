package main

import (
	"fmt"
	"strings"
)

func sosDp(n int, f []int) []int {
	size := 1 << n
	sos := make([]int, size)
	copy(sos, f)

	for i := 0; i < n; i++ {
		for mask := 0; mask < size; mask++ {
			if mask&(1<<i) != 0 {
				sos[mask] += sos[mask^(1<<i)]
			}
		}
	}
	return sos
}

func main() {
	var n int
	fmt.Scan(&n)
	size := 1 << n
	f := make([]int, size)
	for i := 0; i < size; i++ {
		fmt.Scan(&f[i])
	}
	result := sosDp(n, f)
	strs := make([]string, size)
	for i, v := range result {
		strs[i] = fmt.Sprintf("%d", v)
	}
	fmt.Println(strings.Join(strs, " "))
}

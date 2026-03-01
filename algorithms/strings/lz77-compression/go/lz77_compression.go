package main

import "fmt"

func Lz77Compression(arr []int) int {
	n := len(arr); count := 0; i := 0
	for i < n {
		bestLen := 0; start := i - 256; if start < 0 { start = 0 }
		for j := start; j < i; j++ {
			l := 0; dist := i - j
			for i+l < n && l < dist && arr[j+l] == arr[i+l] { l++ }
			if l == dist { for i+l < n && arr[j+(l%dist)] == arr[i+l] { l++ } }
			if l > bestLen { bestLen = l }
		}
		if bestLen >= 2 { count++; i += bestLen } else { i++ }
	}
	return count
}

func main() {
	fmt.Println(Lz77Compression([]int{1,2,3,1,2,3}))
	fmt.Println(Lz77Compression([]int{5,5,5,5}))
	fmt.Println(Lz77Compression([]int{1,2,3,4}))
	fmt.Println(Lz77Compression([]int{1,2,1,2,3,4,3,4}))
}

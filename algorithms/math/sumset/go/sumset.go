package sumset

import "sort"

func sumset(setA []int, setB []int) []int {
	result := make([]int, 0, len(setA)*len(setB))
	for _, a := range setA {
		for _, b := range setB {
			result = append(result, a+b)
		}
	}
	sort.Ints(result)
	return result
}

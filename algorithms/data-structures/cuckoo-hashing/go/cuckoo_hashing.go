package main

import "fmt"

func cuckooHashing(data []int) int {
	n := data[0]
	if n == 0 {
		return 0
	}

	capacity := 2 * n
	if capacity < 11 {
		capacity = 11
	}

	table1 := make([]int, capacity)
	table2 := make([]int, capacity)
	for i := range table1 {
		table1[i] = -1
		table2[i] = -1
	}
	inserted := make(map[int]bool)

	h1 := func(key int) int { return ((key % capacity) + capacity) % capacity }
	h2 := func(key int) int { return (((key/capacity + 1) % capacity) + capacity) % capacity }

	for i := 1; i <= n; i++ {
		key := data[i]
		if inserted[key] {
			continue
		}
		if table1[h1(key)] == key || table2[h2(key)] == key {
			inserted[key] = true
			continue
		}

		current := key
		success := false
		for iter := 0; iter < 2*capacity; iter++ {
			pos1 := h1(current)
			if table1[pos1] == -1 {
				table1[pos1] = current
				success = true
				break
			}
			current, table1[pos1] = table1[pos1], current

			pos2 := h2(current)
			if table2[pos2] == -1 {
				table2[pos2] = current
				success = true
				break
			}
			current, table2[pos2] = table2[pos2], current
		}
		if success {
			inserted[key] = true
		}
	}
	return len(inserted)
}

func main() {
	fmt.Println(cuckooHashing([]int{3, 10, 20, 30}))
	fmt.Println(cuckooHashing([]int{4, 5, 5, 5, 5}))
	fmt.Println(cuckooHashing([]int{5, 1, 2, 3, 4, 5}))
}

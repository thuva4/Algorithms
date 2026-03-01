package countsetbits

func CountSetBits(arr []int) int {
	total := 0
	for _, num := range arr {
		for num != 0 {
			total++
			num &= num - 1
		}
	}
	return total
}

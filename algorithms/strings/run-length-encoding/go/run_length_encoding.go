package runlengthencoding

// RunLengthEncoding encodes an array using run-length encoding.
func RunLengthEncoding(arr []int) []int {
	if len(arr) == 0 { return []int{} }
	result := []int{}
	count := 1
	for i := 1; i < len(arr); i++ {
		if arr[i] == arr[i-1] { count++ } else {
			result = append(result, arr[i-1], count)
			count = 1
		}
	}
	result = append(result, arr[len(arr)-1], count)
	return result
}

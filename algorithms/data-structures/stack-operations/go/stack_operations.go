package stackoperations

// StackOps processes stack operations and returns sum of popped values.
func StackOps(arr []int) int {
	if len(arr) == 0 {
		return 0
	}
	stack := []int{}
	opCount := arr[0]
	idx := 1
	total := 0
	for i := 0; i < opCount; i++ {
		t := arr[idx]
		idx += 2
		if t == 1 {
			stack = append(stack, arr[idx-1])
		} else if t == 2 {
			if len(stack) > 0 {
				total += stack[len(stack)-1]
				stack = stack[:len(stack)-1]
			} else {
				total += -1
			}
		}
	}
	return total
}

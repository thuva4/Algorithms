package queueoperations

// QueueOps processes queue operations and returns sum of dequeued values.
func QueueOps(arr []int) int {
	if len(arr) == 0 {
		return 0
	}
	queue := []int{}
	opCount := arr[0]
	idx := 1
	total := 0
	front := 0
	for i := 0; i < opCount; i++ {
		t := arr[idx]
		v := arr[idx+1]
		idx += 2
		if t == 1 {
			queue = append(queue, v)
		} else if t == 2 && front < len(queue) {
			total += queue[front]
			front++
		}
	}
	return total
}

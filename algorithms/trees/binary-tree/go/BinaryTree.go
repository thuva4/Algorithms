package binarytree

// LevelOrderTraversal performs level order traversal on a binary tree
// represented as an array. Nil values are represented as -1.
func LevelOrderTraversal(arr []int) []int {
	if len(arr) == 0 {
		return []int{}
	}

	result := []int{}
	queue := []int{0}

	for len(queue) > 0 {
		idx := queue[0]
		queue = queue[1:]

		if idx < len(arr) && arr[idx] != -1 {
			result = append(result, arr[idx])
			left := 2*idx + 1
			right := 2*idx + 2
			if left < len(arr) && arr[left] != -1 {
				queue = append(queue, left)
			}
			if right < len(arr) && arr[right] != -1 {
				queue = append(queue, right)
			}
		}
	}
	return result
}

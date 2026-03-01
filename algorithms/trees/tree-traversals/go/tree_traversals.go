package treetraversals

func inorderHelper(arr []int, i int, result *[]int) {
	if i >= len(arr) || arr[i] == -1 {
		return
	}
	inorderHelper(arr, 2*i+1, result)
	*result = append(*result, arr[i])
	inorderHelper(arr, 2*i+2, result)
}

// TreeTraversals returns inorder traversal of a level-order binary tree array.
func TreeTraversals(arr []int) []int {
	result := []int{}
	inorderHelper(arr, 0, &result)
	return result
}

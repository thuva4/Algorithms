package bst

type node struct {
	key   int
	left  *node
	right *node
}

func insertNode(root *node, key int) *node {
	if root == nil {
		return &node{key: key}
	}
	if key <= root.key {
		root.left = insertNode(root.left, key)
	} else {
		root.right = insertNode(root.right, key)
	}
	return root
}

func inorder(root *node, result *[]int) {
	if root == nil {
		return
	}
	inorder(root.left, result)
	*result = append(*result, root.key)
	inorder(root.right, result)
}

// BstInorder inserts all elements into a BST and returns the inorder traversal.
func BstInorder(arr []int) []int {
	var root *node
	for _, key := range arr {
		root = insertNode(root, key)
	}

	result := make([]int, 0, len(arr))
	inorder(root, &result)
	return result
}

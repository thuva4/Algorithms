package treesort

type Node struct {
	key   int
	left  *Node
	right *Node
}

func TreeSort(arr []int) {
	var root *Node
	for _, v := range arr {
		root = insert(root, v)
	}

	i := 0
	storeSorted(root, arr, &i)
}

func insert(root *Node, key int) *Node {
	if root == nil {
		return &Node{key: key}
	}

	if key < root.key {
		root.left = insert(root.left, key)
	} else {
		root.right = insert(root.right, key)
	}

	return root
}

func storeSorted(root *Node, arr []int, i *int) {
	if root != nil {
		storeSorted(root.left, arr, i)
		arr[*i] = root.key
		*i++
		storeSorted(root.right, arr, i)
	}
}

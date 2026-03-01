package avltree

type avlNode struct {
	key    int
	left   *avlNode
	right  *avlNode
	height int
}

func newNode(key int) *avlNode {
	return &avlNode{key: key, height: 1}
}

func nodeHeight(n *avlNode) int {
	if n == nil {
		return 0
	}
	return n.height
}

func maxInt(a, b int) int {
	if a > b {
		return a
	}
	return b
}

func updateHeight(n *avlNode) {
	n.height = 1 + maxInt(nodeHeight(n.left), nodeHeight(n.right))
}

func balanceFactor(n *avlNode) int {
	if n == nil {
		return 0
	}
	return nodeHeight(n.left) - nodeHeight(n.right)
}

func rotateRight(y *avlNode) *avlNode {
	x := y.left
	t2 := x.right
	x.right = y
	y.left = t2
	updateHeight(y)
	updateHeight(x)
	return x
}

func rotateLeft(x *avlNode) *avlNode {
	y := x.right
	t2 := y.left
	y.left = x
	x.right = t2
	updateHeight(x)
	updateHeight(y)
	return y
}

func insert(node *avlNode, key int) *avlNode {
	if node == nil {
		return newNode(key)
	}
	if key < node.key {
		node.left = insert(node.left, key)
	} else if key > node.key {
		node.right = insert(node.right, key)
	} else {
		return node
	}

	updateHeight(node)
	bf := balanceFactor(node)

	if bf > 1 && key < node.left.key {
		return rotateRight(node)
	}
	if bf < -1 && key > node.right.key {
		return rotateLeft(node)
	}
	if bf > 1 && key > node.left.key {
		node.left = rotateLeft(node.left)
		return rotateRight(node)
	}
	if bf < -1 && key < node.right.key {
		node.right = rotateRight(node.right)
		return rotateLeft(node)
	}

	return node
}

func inorder(node *avlNode, result *[]int) {
	if node == nil {
		return
	}
	inorder(node.left, result)
	*result = append(*result, node.key)
	inorder(node.right, result)
}

// AvlInsertInorder inserts elements into an AVL tree and returns the inorder traversal.
func AvlInsertInorder(arr []int) []int {
	var root *avlNode
	for _, val := range arr {
		root = insert(root, val)
	}
	result := []int{}
	inorder(root, &result)
	return result
}

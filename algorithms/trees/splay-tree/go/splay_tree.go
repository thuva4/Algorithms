package splaytree

type snode struct {
	key         int
	left, right *snode
}

func rightRotate(x *snode) *snode {
	y := x.left
	x.left = y.right
	y.right = x
	return y
}

func leftRotate(x *snode) *snode {
	y := x.right
	x.right = y.left
	y.left = x
	return y
}

func splayOp(root *snode, key int) *snode {
	if root == nil || root.key == key {
		return root
	}
	if key < root.key {
		if root.left == nil {
			return root
		}
		if key < root.left.key {
			root.left.left = splayOp(root.left.left, key)
			root = rightRotate(root)
		} else if key > root.left.key {
			root.left.right = splayOp(root.left.right, key)
			if root.left.right != nil {
				root.left = leftRotate(root.left)
			}
		}
		if root.left == nil {
			return root
		}
		return rightRotate(root)
	}
	if root.right == nil {
		return root
	}
	if key > root.right.key {
		root.right.right = splayOp(root.right.right, key)
		root = leftRotate(root)
	} else if key < root.right.key {
		root.right.left = splayOp(root.right.left, key)
		if root.right.left != nil {
			root.right = rightRotate(root.right)
		}
	}
	if root.right == nil {
		return root
	}
	return leftRotate(root)
}

func insertNode(root *snode, key int) *snode {
	if root == nil {
		return &snode{key: key}
	}
	root = splayOp(root, key)
	if root.key == key {
		return root
	}
	node := &snode{key: key}
	if key < root.key {
		node.right = root
		node.left = root.left
		root.left = nil
	} else {
		node.left = root
		node.right = root.right
		root.right = nil
	}
	return node
}

func inorder(node *snode, result *[]int) {
	if node == nil {
		return
	}
	inorder(node.left, result)
	*result = append(*result, node.key)
	inorder(node.right, result)
}

// SplayTree inserts values into a splay tree and returns sorted inorder traversal.
func SplayTree(arr []int) []int {
	var root *snode
	for _, val := range arr {
		root = insertNode(root, val)
	}
	result := []int{}
	inorder(root, &result)
	return result
}

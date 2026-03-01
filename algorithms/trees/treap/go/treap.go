package treap

import "math/rand"

type tnode struct {
	key, priority int
	left, right   *tnode
}

func rightRot(p *tnode) *tnode {
	q := p.left
	p.left = q.right
	q.right = p
	return q
}

func leftRot(p *tnode) *tnode {
	q := p.right
	p.right = q.left
	q.left = p
	return q
}

func insertNode(root *tnode, key int) *tnode {
	if root == nil {
		return &tnode{key: key, priority: rand.Int()}
	}
	if key < root.key {
		root.left = insertNode(root.left, key)
		if root.left.priority > root.priority {
			root = rightRot(root)
		}
	} else if key > root.key {
		root.right = insertNode(root.right, key)
		if root.right.priority > root.priority {
			root = leftRot(root)
		}
	}
	return root
}

func inorderCollect(node *tnode, result *[]int) {
	if node == nil {
		return
	}
	inorderCollect(node.left, result)
	*result = append(*result, node.key)
	inorderCollect(node.right, result)
}

// Treap inserts values into a treap and returns sorted inorder traversal.
func Treap(arr []int) []int {
	var root *tnode
	for _, val := range arr {
		root = insertNode(root, val)
	}
	result := []int{}
	inorderCollect(root, &result)
	return result
}

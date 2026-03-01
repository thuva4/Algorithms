package redblacktree

const (
	red   = true
	black = false
)

type rbNode struct {
	key    int
	left   *rbNode
	right  *rbNode
	parent *rbNode
	color  bool
}

var rbRoot *rbNode

func rotateLeftRB(x *rbNode) {
	y := x.right
	x.right = y.left
	if y.left != nil {
		y.left.parent = x
	}
	y.parent = x.parent
	if x.parent == nil {
		rbRoot = y
	} else if x == x.parent.left {
		x.parent.left = y
	} else {
		x.parent.right = y
	}
	y.left = x
	x.parent = y
}

func rotateRightRB(x *rbNode) {
	y := x.left
	x.left = y.right
	if y.right != nil {
		y.right.parent = x
	}
	y.parent = x.parent
	if x.parent == nil {
		rbRoot = y
	} else if x == x.parent.right {
		x.parent.right = y
	} else {
		x.parent.left = y
	}
	y.right = x
	x.parent = y
}

func fixInsert(z *rbNode) {
	for z.parent != nil && z.parent.color == red {
		gp := z.parent.parent
		if z.parent == gp.left {
			y := gp.right
			if y != nil && y.color == red {
				z.parent.color = black
				y.color = black
				gp.color = red
				z = gp
			} else {
				if z == z.parent.right {
					z = z.parent
					rotateLeftRB(z)
				}
				z.parent.color = black
				z.parent.parent.color = red
				rotateRightRB(z.parent.parent)
			}
		} else {
			y := gp.left
			if y != nil && y.color == red {
				z.parent.color = black
				y.color = black
				gp.color = red
				z = gp
			} else {
				if z == z.parent.left {
					z = z.parent
					rotateRightRB(z)
				}
				z.parent.color = black
				z.parent.parent.color = red
				rotateLeftRB(z.parent.parent)
			}
		}
	}
	rbRoot.color = black
}

func insertKey(key int) {
	var y *rbNode
	x := rbRoot
	for x != nil {
		y = x
		if key < x.key {
			x = x.left
		} else if key > x.key {
			x = x.right
		} else {
			return
		}
	}
	node := &rbNode{key: key, color: red, parent: y}
	if y == nil {
		rbRoot = node
	} else if key < y.key {
		y.left = node
	} else {
		y.right = node
	}
	fixInsert(node)
}

func inorderRB(node *rbNode, result *[]int) {
	if node == nil {
		return
	}
	inorderRB(node.left, result)
	*result = append(*result, node.key)
	inorderRB(node.right, result)
}

// RbInsertInorder inserts elements into a Red-Black tree and returns inorder traversal.
func RbInsertInorder(arr []int) []int {
	rbRoot = nil
	for _, val := range arr {
		insertKey(val)
	}
	result := []int{}
	inorderRB(rbRoot, &result)
	return result
}

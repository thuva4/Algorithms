package btree

const t = 3
const maxKeys = 2*t - 1

type node struct {
	keys     [maxKeys]int
	children [maxKeys + 1]*node
	n        int
	leaf     bool
}

func newNode(leaf bool) *node {
	return &node{leaf: leaf}
}

func splitChild(parent *node, i int) {
	full := parent.children[i]
	nn := newNode(full.leaf)
	nn.n = t - 1
	for j := 0; j < t-1; j++ {
		nn.keys[j] = full.keys[j+t]
	}
	if !full.leaf {
		for j := 0; j < t; j++ {
			nn.children[j] = full.children[j+t]
			full.children[j+t] = nil
		}
	}
	for j := parent.n; j > i; j-- {
		parent.children[j+1] = parent.children[j]
	}
	parent.children[i+1] = nn
	for j := parent.n - 1; j >= i; j-- {
		parent.keys[j+1] = parent.keys[j]
	}
	parent.keys[i] = full.keys[t-1]
	full.n = t - 1
	parent.n++
}

func insertNonFull(nd *node, key int) {
	i := nd.n - 1
	if nd.leaf {
		for i >= 0 && key < nd.keys[i] {
			nd.keys[i+1] = nd.keys[i]
			i--
		}
		nd.keys[i+1] = key
		nd.n++
	} else {
		for i >= 0 && key < nd.keys[i] {
			i--
		}
		i++
		if nd.children[i].n == maxKeys {
			splitChild(nd, i)
			if key > nd.keys[i] {
				i++
			}
		}
		insertNonFull(nd.children[i], key)
	}
}

func inorder(nd *node, result *[]int) {
	if nd == nil {
		return
	}
	for i := 0; i < nd.n; i++ {
		if !nd.leaf {
			inorder(nd.children[i], result)
		}
		*result = append(*result, nd.keys[i])
	}
	if !nd.leaf {
		inorder(nd.children[nd.n], result)
	}
}

// BTree inserts values into a B-Tree and returns sorted inorder traversal.
func BTree(arr []int) []int {
	if len(arr) == 0 {
		return []int{}
	}
	root := newNode(true)
	for _, val := range arr {
		if root.n == maxKeys {
			newRoot := newNode(false)
			newRoot.children[0] = root
			splitChild(newRoot, 0)
			root = newRoot
		}
		insertNonFull(root, val)
	}
	result := []int{}
	inorder(root, &result)
	return result
}

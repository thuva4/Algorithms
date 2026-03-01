package main

import (
	"fmt"
	"math"
)

type FibNode struct {
	key, degree         int
	parent, child       *FibNode
	left, right         *FibNode
	mark                bool
}

type FibHeap struct {
	minNode *FibNode
	n       int
}

func newNode(key int) *FibNode {
	n := &FibNode{key: key}
	n.left = n
	n.right = n
	return n
}

func (h *FibHeap) addToRootList(node *FibNode) {
	node.left = h.minNode
	node.right = h.minNode.right
	h.minNode.right.left = node
	h.minNode.right = node
}

func removeFromList(node *FibNode) {
	node.left.right = node.right
	node.right.left = node.left
}

func getSiblings(node *FibNode) []*FibNode {
	var sibs []*FibNode
	curr := node
	for {
		sibs = append(sibs, curr)
		curr = curr.right
		if curr == node {
			break
		}
	}
	return sibs
}

func (h *FibHeap) link(y, x *FibNode) {
	removeFromList(y)
	y.left = y
	y.right = y
	if x.child == nil {
		x.child = y
	} else {
		y.left = x.child
		y.right = x.child.right
		x.child.right.left = y
		x.child.right = y
	}
	y.parent = x
	x.degree++
	y.mark = false
}

func (h *FibHeap) consolidate() {
	maxDeg := int(math.Log2(float64(h.n))) + 2
	A := make([]*FibNode, maxDeg+1)
	roots := getSiblings(h.minNode)
	for _, w := range roots {
		x := w
		d := x.degree
		for d < len(A) && A[d] != nil {
			y := A[d]
			if x.key > y.key {
				x, y = y, x
			}
			h.link(y, x)
			A[d] = nil
			d++
		}
		for d >= len(A) {
			A = append(A, nil)
		}
		A[d] = x
	}
	h.minNode = nil
	for _, node := range A {
		if node != nil {
			node.left = node
			node.right = node
			if h.minNode == nil {
				h.minNode = node
			} else {
				h.addToRootList(node)
				if node.key < h.minNode.key {
					h.minNode = node
				}
			}
		}
	}
}

func (h *FibHeap) insert(key int) {
	node := newNode(key)
	if h.minNode == nil {
		h.minNode = node
	} else {
		h.addToRootList(node)
		if node.key < h.minNode.key {
			h.minNode = node
		}
	}
	h.n++
}

func (h *FibHeap) extractMin() int {
	z := h.minNode
	if z == nil {
		return -1
	}
	if z.child != nil {
		children := getSiblings(z.child)
		for _, c := range children {
			h.addToRootList(c)
			c.parent = nil
		}
	}
	removeFromList(z)
	if z == z.right {
		h.minNode = nil
	} else {
		h.minNode = z.right
		h.consolidate()
	}
	h.n--
	return z.key
}

func fibonacciHeap(operations []int) []int {
	heap := &FibHeap{}
	var results []int
	for _, op := range operations {
		if op == 0 {
			results = append(results, heap.extractMin())
		} else {
			heap.insert(op)
		}
	}
	return results
}

func main() {
	fmt.Println(fibonacciHeap([]int{3, 1, 4, 0, 0}))
	fmt.Println(fibonacciHeap([]int{5, 2, 8, 1, 0, 0, 0, 0}))
}

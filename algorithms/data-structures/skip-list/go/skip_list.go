package skiplist

import (
	"math"
	"math/rand"
)

const maxLevel = 16

type skipNode struct {
	key     int
	forward [maxLevel + 1]*skipNode
}

// SkipList inserts values into a skip list and returns sorted order.
func SkipList(arr []int) []int {
	header := &skipNode{key: math.MinInt64}
	level := 0

	for _, val := range arr {
		var update [maxLevel + 1]*skipNode
		current := header
		for i := level; i >= 0; i-- {
			for current.forward[i] != nil && current.forward[i].key < val {
				current = current.forward[i]
			}
			update[i] = current
		}
		current = current.forward[0]
		if current != nil && current.key == val {
			continue
		}

		newLevel := 0
		for rand.Intn(2) == 1 && newLevel < maxLevel {
			newLevel++
		}
		if newLevel > level {
			for i := level + 1; i <= newLevel; i++ {
				update[i] = header
			}
			level = newLevel
		}
		newNode := &skipNode{key: val}
		for i := 0; i <= newLevel; i++ {
			newNode.forward[i] = update[i].forward[i]
			update[i].forward[i] = newNode
		}
	}

	result := []int{}
	node := header.forward[0]
	for node != nil {
		result = append(result, node.key)
		node = node.forward[0]
	}
	return result
}

package linkedlistoperations

type node struct {
	value int
	next  *node
}

func buildList(arr []int) *node {
	if len(arr) == 0 {
		return nil
	}
	head := &node{value: arr[0]}
	current := head
	for i := 1; i < len(arr); i++ {
		current.next = &node{value: arr[i]}
		current = current.next
	}
	return head
}

func toArray(head *node) []int {
	result := []int{}
	current := head
	for current != nil {
		result = append(result, current.value)
		current = current.next
	}
	return result
}

// ReverseLinkedList builds a linked list from an array, reverses it, and returns the result as an array.
func ReverseLinkedList(arr []int) []int {
	head := buildList(arr)

	var prev *node
	current := head
	for current != nil {
		next := current.next
		current.next = prev
		prev = current
		current = next
	}

	return toArray(prev)
}

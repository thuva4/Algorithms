package fenwicktree

// FenwickTree implements a Binary Indexed Tree for prefix sum queries and point updates.
type FenwickTree struct {
	tree []int
	n    int
}

// New creates a FenwickTree from the given array.
func New(arr []int) *FenwickTree {
	n := len(arr)
	ft := &FenwickTree{
		tree: make([]int, n+1),
		n:    n,
	}
	for i, v := range arr {
		ft.Update(i, v)
	}
	return ft
}

// Update adds delta to the element at index i.
func (ft *FenwickTree) Update(i, delta int) {
	for i++; i <= ft.n; i += i & (-i) {
		ft.tree[i] += delta
	}
}

// Query returns the prefix sum from index 0 to i (inclusive).
func (ft *FenwickTree) Query(i int) int {
	sum := 0
	for i++; i > 0; i -= i & (-i) {
		sum += ft.tree[i]
	}
	return sum
}

func fenwickInt(value interface{}) (int, bool) {
	switch typed := value.(type) {
	case int:
		return typed, true
	case int64:
		return int(typed), true
	case float64:
		return int(typed), true
	default:
		return 0, false
	}
}

func fenwick_tree_operations(array []int, queries []map[string]interface{}) []int {
	values := make([]int, len(array))
	copy(values, array)
	ft := New(values)
	results := make([]int, 0)
	for _, query := range queries {
		queryType, _ := query["type"].(string)
		index, okIndex := fenwickInt(query["index"])
		if !okIndex {
			continue
		}
		if queryType == "update" {
			value, okValue := fenwickInt(query["value"])
			if !okValue {
				continue
			}
			delta := value - values[index]
			values[index] = value
			ft.Update(index, delta)
		} else if queryType == "sum" {
			results = append(results, ft.Query(index))
		}
	}
	return results
}

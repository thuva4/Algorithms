package segmenttree

// SegmentTree supports range sum queries and point updates.
type SegmentTree struct {
	tree []int
	n    int
}

// New creates a SegmentTree from the given array.
func New(arr []int) *SegmentTree {
	n := len(arr)
	st := &SegmentTree{
		tree: make([]int, 4*n),
		n:    n,
	}
	if n > 0 {
		st.build(arr, 0, 0, n-1)
	}
	return st
}

func (st *SegmentTree) build(arr []int, node, start, end int) {
	if start == end {
		st.tree[node] = arr[start]
		return
	}
	mid := (start + end) / 2
	st.build(arr, 2*node+1, start, mid)
	st.build(arr, 2*node+2, mid+1, end)
	st.tree[node] = st.tree[2*node+1] + st.tree[2*node+2]
}

// Update sets the value at index idx to val.
func (st *SegmentTree) Update(idx, val int) {
	st.update(0, 0, st.n-1, idx, val)
}

func (st *SegmentTree) update(node, start, end, idx, val int) {
	if start == end {
		st.tree[node] = val
		return
	}
	mid := (start + end) / 2
	if idx <= mid {
		st.update(2*node+1, start, mid, idx, val)
	} else {
		st.update(2*node+2, mid+1, end, idx, val)
	}
	st.tree[node] = st.tree[2*node+1] + st.tree[2*node+2]
}

// Query returns the sum of elements in the range [l, r].
func (st *SegmentTree) Query(l, r int) int {
	return st.query(0, 0, st.n-1, l, r)
}

func (st *SegmentTree) query(node, start, end, l, r int) int {
	if r < start || end < l {
		return 0
	}
	if l <= start && end <= r {
		return st.tree[node]
	}
	mid := (start + end) / 2
	return st.query(2*node+1, start, mid, l, r) +
		st.query(2*node+2, mid+1, end, l, r)
}

func segInt(value interface{}) (int, bool) {
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

func segment_tree_operations(array []int, queries []map[string]interface{}) []int {
	st := New(array)
	results := make([]int, 0)
	for _, query := range queries {
		queryType, _ := query["type"].(string)
		if queryType == "update" {
			index, okIndex := segInt(query["index"])
			value, okValue := segInt(query["value"])
			if okIndex && okValue {
				st.Update(index, value)
			}
		} else if queryType == "sum" {
			left, okLeft := segInt(query["left"])
			right, okRight := segInt(query["right"])
			if okLeft && okRight {
				results = append(results, st.Query(left, right))
			}
		}
	}
	return results
}

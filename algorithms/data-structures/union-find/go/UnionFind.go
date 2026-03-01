package unionfind

// UnionFind implements a disjoint-set data structure with path compression and union by rank.
type UnionFind struct {
	parent []int
	rank   []int
}

// New creates a new UnionFind with n elements.
func New(n int) *UnionFind {
	parent := make([]int, n)
	rank := make([]int, n)
	for i := 0; i < n; i++ {
		parent[i] = i
	}
	return &UnionFind{parent: parent, rank: rank}
}

// Find returns the root of the set containing x, with path compression.
func (uf *UnionFind) Find(x int) int {
	if uf.parent[x] != x {
		uf.parent[x] = uf.Find(uf.parent[x])
	}
	return uf.parent[x]
}

// Union merges the sets containing x and y.
func (uf *UnionFind) Union(x, y int) {
	px, py := uf.Find(x), uf.Find(y)
	if px == py {
		return
	}
	if uf.rank[px] < uf.rank[py] {
		px, py = py, px
	}
	uf.parent[py] = px
	if uf.rank[px] == uf.rank[py] {
		uf.rank[px]++
	}
}

// Connected checks if x and y are in the same set.
func (uf *UnionFind) Connected(x, y int) bool {
	return uf.Find(x) == uf.Find(y)
}

func ufInt(value interface{}) (int, bool) {
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

func union_find_operations(n int, operations []map[string]interface{}) []bool {
	uf := New(n)
	results := make([]bool, 0)
	for _, operation := range operations {
		opType, _ := operation["type"].(string)
		a, okA := ufInt(operation["a"])
		b, okB := ufInt(operation["b"])
		if !okA || !okB {
			continue
		}
		if opType == "union" {
			uf.Union(a, b)
		} else if opType == "find" {
			results = append(results, uf.Connected(a, b))
		}
	}
	return results
}

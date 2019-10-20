package bf

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestBellmanFord(t *testing.T) {

	g := graph{
		nodes: map[int]Node{
			1: &node{
				id: 1,
			},
			2: &node{
				id: 2,
			},
			3: &node{
				id: 3,
			},
			4: &node{
				id: 4,
			},
			5: &node{
				id: 5,
			},
		},
		edges: map[int][]Edge{
			1: []Edge{
				&edge{
					head:   2,
					weight: 20,
				},
				&edge{
					head:   3,
					weight: 20,
				},
				&edge{
					head:   4,
					weight: 10,
				},
			},
			4: []Edge{
				&edge{
					head:   5,
					weight: 10,
				},
			},
			5: []Edge{
				&edge{
					head:   2,
					weight: -10,
				},
			},
		},
	}

	dist, err := BellmanFord(&g, 1)
	if err != nil {
		t.Errorf("Cycle found where there should not be any cycle")
	}

	for key := range dist {
		if key == 1 {
			assert.Equal(t, dist[key], float64(0))
		}
		if key == 2 {
			assert.Equal(t, dist[key], float64(10))
		}
		if key == 3 {
			assert.Equal(t, dist[key], float64(20))
		}
		if key == 4 {
			assert.Equal(t, dist[key], float64(10))
		}
		if key == 5 {
			assert.Equal(t, dist[key], float64(20))
		}
	}

}

func TestBellmanFordCycle(t *testing.T) {

	g := graph{
		nodes: map[int]Node{
			1: &node{
				id: 1,
			},
			2: &node{
				id: 2,
			},
			3: &node{
				id: 3,
			},
			4: &node{
				id: 4,
			},
			5: &node{
				id: 5,
			},
		},
		edges: map[int][]Edge{
			1: []Edge{
				&edge{
					head:   2,
					weight: 20,
				},
				&edge{
					head:   3,
					weight: 20,
				},
				&edge{
					head:   4,
					weight: 10,
				},
			},
			4: []Edge{
				&edge{
					head:   5,
					weight: 10,
				},
			},
			5: []Edge{
				&edge{
					head:   1,
					weight: -40,
				},
			},
		},
	}

	_, err := BellmanFord(&g, 1)
	if err == nil {
		t.Errorf("Cycle not found where there should be cycle (1-4-5-1")
	}

}

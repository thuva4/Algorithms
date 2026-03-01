package cycledetectionfloyd

// DetectCycle uses Floyd's tortoise and hare algorithm to find the start
// of a cycle. arr[i] is the next index after i. Returns -1 if no cycle.
func DetectCycle(arr []int) int {
	n := len(arr)
	if n == 0 {
		return -1
	}

	nextPos := func(pos int) int {
		if pos < 0 || pos >= n || arr[pos] == -1 {
			return -1
		}
		return arr[pos]
	}

	tortoise := 0
	hare := 0

	// Phase 1: Detect cycle
	for {
		tortoise = nextPos(tortoise)
		if tortoise == -1 {
			return -1
		}

		hare = nextPos(hare)
		if hare == -1 {
			return -1
		}
		hare = nextPos(hare)
		if hare == -1 {
			return -1
		}

		if tortoise == hare {
			break
		}
	}

	// Phase 2: Find cycle start
	pointer1 := 0
	pointer2 := tortoise
	for pointer1 != pointer2 {
		pointer1 = arr[pointer1]
		pointer2 = arr[pointer2]
	}

	return pointer1
}

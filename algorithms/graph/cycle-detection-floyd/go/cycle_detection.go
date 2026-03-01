package cycledetectionfloyd

func DetectCycle(arr []int) int {
	size := len(arr)
	if size == 0 {
		return -1
	}

	tortoise := 0
	hare := 0

	for {
		if tortoise < 0 || tortoise >= size || arr[tortoise] < 0 || arr[tortoise] >= size {
			return -1
		}
		tortoise = arr[tortoise]

		if hare < 0 || hare >= size || arr[hare] < 0 || arr[hare] >= size {
			return -1
		}
		hare = arr[hare]
		if hare < 0 || hare >= size || arr[hare] < 0 || arr[hare] >= size {
			return -1
		}
		hare = arr[hare]

		if tortoise == hare {
			break
		}
	}

	tortoise = 0
	for tortoise != hare {
		tortoise = arr[tortoise]
		hare = arr[hare]
	}

	return tortoise
}

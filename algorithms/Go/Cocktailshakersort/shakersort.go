package main

func shakersort(array []int) {
	swapped := true
	for swapped {

		swapped = false
		for i := 0; i < len(array)-2; i++ {
			if array[i] > array[i+1] {
				array[i], array[i+1] = array[i+1], array[i]
				swapped = true
			}
		}

		if !swapped {
			break
		}

		swapped = false
		for i := len(array) - 2; i >= 0; i-- {
			if array[i] > array[i+1] {
				array[i], array[i+1] = array[i+1], array[i]
				swapped = true
			}
		}
	}
}

func main() {}

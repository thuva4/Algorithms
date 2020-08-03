package countinv

func CountInversions(arr []int) int {
	tmp := make([]int, len(arr))
	return mergeSort(arr, tmp, 0, len(arr)-1)
}

func mergeSort(arr []int, tmp []int, lft, rgt int) int {
	mid := 0
	invCnt := 0
	if rgt > lft {
		mid = (rgt + lft) / 2

		invCnt = mergeSort(arr, tmp, lft, mid)
		invCnt += mergeSort(arr, tmp, mid+1, rgt)

		invCnt += merge(arr, tmp, lft, mid+1, rgt)
	}

	return invCnt
}

func merge(arr []int, tmp []int, lft, mid, rgt int) int {
	i, j, k := lft, mid, lft
	invCnt := 0

	for i <= (mid-1) && j <= rgt {
		if arr[i] <= arr[j] {
			tmp[k] = arr[i]
			k++
			i++
		} else {
			tmp[k] = arr[j]
			k++
			j++
			invCnt += (mid - i)
		}
	}

	for i <= (mid - 1) {
		tmp[k] = arr[i]
		i++
		k++
	}

	for j <= rgt {
		tmp[k] = arr[j]
		k++
		j++
	}

	for i = lft; i <= rgt; i++ {
		arr[i] = tmp[i]
	}

	return invCnt
}

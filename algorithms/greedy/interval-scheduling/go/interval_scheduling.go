package intervalscheduling

import "sort"

func IntervalScheduling(arr []int) int {
	n := arr[0]
	type Interval struct{ start, end int }
	intervals := make([]Interval, n)
	for i := 0; i < n; i++ {
		intervals[i] = Interval{arr[1+2*i], arr[1+2*i+1]}
	}

	sort.Slice(intervals, func(i, j int) bool {
		return intervals[i].end < intervals[j].end
	})

	count := 0
	lastEnd := -1
	for _, iv := range intervals {
		if iv.start >= lastEnd {
			count++
			lastEnd = iv.end
		}
	}

	return count
}

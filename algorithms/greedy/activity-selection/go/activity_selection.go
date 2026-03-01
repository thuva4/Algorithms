package activityselection

import "sort"

// ActivitySelection selects the maximum number of non-overlapping activities.
// The input array encodes activities as consecutive pairs [start, finish, ...].
func ActivitySelection(arr []int) int {
	n := len(arr) / 2
	if n == 0 {
		return 0
	}

	type activity struct {
		start, finish int
	}

	activities := make([]activity, n)
	for i := 0; i < n; i++ {
		activities[i] = activity{arr[2*i], arr[2*i+1]}
	}

	sort.Slice(activities, func(i, j int) bool {
		return activities[i].finish < activities[j].finish
	})

	count := 1
	lastFinish := activities[0].finish

	for i := 1; i < n; i++ {
		if activities[i].start >= lastFinish {
			count++
			lastFinish = activities[i].finish
		}
	}

	return count
}

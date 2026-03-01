package jobscheduling

import "sort"

func JobScheduling(arr []int) int {
	n := arr[0]
	type Job struct{ deadline, profit int }
	jobs := make([]Job, n)
	maxDeadline := 0
	for i := 0; i < n; i++ {
		jobs[i] = Job{arr[1+2*i], arr[1+2*i+1]}
		if jobs[i].deadline > maxDeadline {
			maxDeadline = jobs[i].deadline
		}
	}

	sort.Slice(jobs, func(i, j int) bool {
		return jobs[i].profit > jobs[j].profit
	})

	slots := make([]bool, maxDeadline+1)
	totalProfit := 0

	for _, job := range jobs {
		t := job.deadline
		if t > maxDeadline {
			t = maxDeadline
		}
		for ; t > 0; t-- {
			if !slots[t] {
				slots[t] = true
				totalProfit += job.profit
				break
			}
		}
	}

	return totalProfit
}

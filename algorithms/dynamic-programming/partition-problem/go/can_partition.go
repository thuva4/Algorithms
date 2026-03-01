package partitionproblem

func CanPartition(arr []int) int {
	total := 0
	for _, x := range arr {
		total += x
	}
	if total%2 != 0 {
		return 0
	}
	target := total / 2
	dp := make([]bool, target+1)
	dp[0] = true
	for _, num := range arr {
		for j := target; j >= num; j-- {
			dp[j] = dp[j] || dp[j-num]
		}
	}
	if dp[target] {
		return 1
	}
	return 0
}

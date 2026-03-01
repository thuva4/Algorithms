package main

import (
	"fmt"
	"strconv"
)

var (
	digits    []int
	numDigits int
	targetSum int
	memo      [12][110][2]int
)

func solve(pos, currentSum, tight int) int {
	if currentSum > targetSum {
		return 0
	}
	if pos == numDigits {
		if currentSum == targetSum {
			return 1
		}
		return 0
	}
	if memo[pos][currentSum][tight] != -1 {
		return memo[pos][currentSum][tight]
	}

	limit := 9
	if tight == 1 {
		limit = digits[pos]
	}
	result := 0
	for d := 0; d <= limit; d++ {
		newTight := 0
		if tight == 1 && d == limit {
			newTight = 1
		}
		result += solve(pos+1, currentSum+d, newTight)
	}

	memo[pos][currentSum][tight] = result
	return result
}

func digitDp(n, target int) int {
	if n <= 0 {
		return 0
	}
	targetSum = target

	s := strconv.Itoa(n)
	numDigits = len(s)
	digits = make([]int, numDigits)
	for i := 0; i < numDigits; i++ {
		digits[i] = int(s[i] - '0')
	}

	for i := range memo {
		for j := range memo[i] {
			for k := range memo[i][j] {
				memo[i][j][k] = -1
			}
		}
	}

	result := solve(0, 0, 1)
	if target == 0 {
		// Exclude zero because the contract counts numbers in 1..N.
		result--
	}
	return result
}

func main() {
	var n, target int
	fmt.Scan(&n, &target)
	fmt.Println(digitDp(n, target))
}

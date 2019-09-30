def kadane(A):
	max_so_far = max_ending = 0
	for x in A:
		max_ending = max(0, max_ending + x)
		max_so_far = max(max_so_far, max_ending)
	return max_so_far

A = [-2, -3, 4, -1, -2, 1, 5, -3]
print "Maximum contiguous sum is", kadane(A)

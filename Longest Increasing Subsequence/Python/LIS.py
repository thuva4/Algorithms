"""
This program is for Longest Increasing Subsequence in O(n^2) time complexity.
This program is compatible with python 2 and python 3 as well.
"""

try:
	input = raw_input
except:
	pass

def LIS(num):
	ans = 0
	ind = 0
	size = len(num)
	par_arr = [-1]*size		#Used for tracking parents.
	lis_arr = [1]*size
	for i in range(1,size):
		for j in range(0,i):
			if num[j] < num[i]:
				if lis_arr[j] + 1 > lis_arr[i]:
					lis_arr[i] = lis_arr[j] + 1
					par_arr[i] = j
				#lis_arr[i] = max(lis_arr[i] , lis_arr[j]+1)
				#ans = max(lis_arr[i] , ans)
				if lis_arr[i] > ans:
					ans = lis_arr[i]
					ind = i
	#print(par_arr)				
	ans_list = []
	while ind >= 0:
		ans_list.append(num[ind])
		ind = par_arr[ind]
	
	ans_list = ans_list[::-1]
	print(ans_list)		# Contains numbers of LIS			
	return ans			
if __name__ == "__main__":
	num_array = list(map(int , input("Enter numbers separated by spaces: ").split(" ")))
	print("LIS is: ",LIS(num_array))	
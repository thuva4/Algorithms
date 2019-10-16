def compAndSwap(a, i, j, dire): 
	if (dire==1 and a[i] > a[j]) or (dire==0 and a[i] > a[j]): 
		a[i],a[j] = a[j],a[i] 

def bitonicMerge(a, low, cnt, dire): 
	if cnt > 1: 
		k = cnt/2
		for i in range(low , low+k): 
			compAndSwap(a, i, i+k, dire) 
		bitonicMerge(a, low, k, dire) 
		bitonicMerge(a, low+k, k, dire) 

def bitonicSort(a, low, cnt,dire): 
	if cnt > 1: 
		k = cnt/2
		bitonicSort(a, low, k, 1) 
		bitonicSort(a, low+k, k, 0) 
		bitonicMerge(a, low, cnt, dire) 

def sort(a,N, up): 
	bitonicSort(a,0, N, up) 

a = [3, 7, 4, 8, 6, 2, 1, 5] 
n = len(a) 
up = 1

sort(a, n, up) 
print ("\n\nSorted array is") 
for i in range(n): 
	print("%d" %a[i]), 

=begin  
#Counting Sort is a linear time sort used when range of keys is already known.
    #Algorithm
    1. Take a count array to store the frequency of each value in given range
    2. change count[i] to count[i]+count[i-1],i.e each element now stores the prefix sum of counts.
    3. take each value from the array and put it at the correct index in output array using count, decrement value of count! (correct index of a[i] will be count[a[i]-1])
    4. Finally copy the values of output array to array.
    
# n is the size of array and k is the range of input
#Time-complexity: O(n+k), Auxiliary-space:O(n+k), Not In-place, Not stable    
=end    


def counting_sort(a=[9,8,7,6],min=0,max=10)
    if min>max
      return "invalid range"
    end
    
  	n=max-min+1
	count=Array.new(n,0)
	len=a.length
	output=Array.new(len)
  
  	for i in 0...len
		count[a[i]-min]+=1
	end
	
  	for i in 1...n
		count[i]+=count[i-1]
	end
		
	
	for i in 0...len
		output[count[a[i]-min]-1]=a[i]
		count[a[i]-min]-=1
	end
	
	for i in 0...len
		a[i]=output[i]
	end
	
	return a
	
end

puts(counting_sort([9,8,1,2,3,7],-3,10))

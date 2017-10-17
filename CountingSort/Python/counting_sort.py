# Python3  implementation for counting sort

def counting_sort(arr):
  m = max(arr) # get the max item in the array to set the index and outputs
  count = [0] * (m+1)
  output = [0] * (m+1)
  
  # store counts into array.
  for x in arr:
    # raise an error if array has non-integers
    if isinstance(x, int):
      count[x] += 1
    else:
      raise TypeError("Invalid item in array. It should be an integer! {}".format(x))
    
  # update count to store index
  total = 0
  for x in range(len(count)):
    temp = count[x]
    count[x] = total
    total += temp

  # update the output based on the counts
  for x in arr:
    output[count[x]] = x
    # increment the index
    count[x] += 1
  
  return output[:len(arr)] # only return values that are updated.

print(counting_sort([1,1,4,2,2,2,3,5,230,9]))

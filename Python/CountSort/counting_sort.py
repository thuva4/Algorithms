

def count_sort(arr):
  m = max(arr)
  count = [0] * (m+1)
  output = [0] * (m+1)

  for x in arr:
    if isinstance(x, int):
      count[x] += 1
    else:
      raise TypeError("Invalid item in array. It should be an integer! {}".format(x))
  total = 0
  for x in range(len(count)):
    temp = count[x]
    count[x] = total
    total += temp
  for x in arr:
    output[count[x]] = x
    count[x] += 1
  
  return output[:len(arr)]

print(counting_sort([1,1,11,1,3,3,3,4,3,2,2,2,3,5,9]))

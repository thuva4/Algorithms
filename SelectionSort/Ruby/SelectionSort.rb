class Array
  #Selection sort Method 
  def selectionsort!
    for i in 0..length-2
      min_idx = i
      for j in (i+1)...length
        min_idx = j  if self[j] < self[min_idx]
      end
      self[i], self[min_idx] = self[min_idx], self[i]
    end
    self
  end
end
ary = [7,6,5,9,8,4,3,1,2,0]
# print the sorted array 
p ary.selectionsort!

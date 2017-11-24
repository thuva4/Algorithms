def merge_sort(arr)
  return arr if arr.length <= 1
  result = []

  left_half = merge_sort(arr[0...arr.length/2])
  right_half = merge_sort(arr[arr.length/2..-1])

  while left_half.length != 0 && right_half.length != 0
    if left_half[0] <= right_half[0]
      result.push(left_half.shift)
    else
      result.push(right_half.shift)
    end
  end

  result + left_half + right_half
end

arr = [6,5,3,1,8,7,2,4]
p merge_sort(arr)

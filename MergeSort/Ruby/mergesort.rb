def merge_sort(lists)
  return lists if lists.count == 1

  middle  = lists[0..(lists.count / 2) - 1 ]
  left = lists[0..middle.count - 1]
  right = lists[middle.count..lists.count]

  x = merge_sort(left)
  y = merge_sort(right)
end

merge_sort [1,2,3,4,5,6,7,8]
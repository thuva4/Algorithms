def heap_sort(array)
  to_heap(array)
  bottom = array.size - 1

  while bottom > 0
    array[0], array[bottom] = array[bottom], array[0]
    sift_down(array, 0, bottom)
    bottom -= 1
  end

  array
end

def to_heap(array)
  i = (array.size/2) - 1

  while i >= 0
    sift_down(array, i, array.size)
    i -= 1
  end

  array
end

def sift_down(array, i, max)
  i_big, c1, c2 = 0, 0, 0

  while i < max
    i_big = i
    c1 = (2*i) + 1
    c2 = c1 + 1

    if c1 < max && array[c1] > array[i_big]
      i_big = c1
    end

    if c2 < max && array[c2] > array[i_big]
      i_big = c2
    end

    break if i_big == i

    array[i], array[i_big] = array[i_big], array[i]

    i = i_big
  end

  array
end

numbers = [4, 2, 8, 1, 30, 0, 10, 16]

puts "Unsorted: #{numbers}"

puts "Sorted: #{heap_sort(numbers)}"

class Array
  def quicksort
    return [] if empty?

    pivot = delete_at(rand(size))
    left, right = partition(&pivot.method(:>))

    return *left.quicksort, pivot, *right.quicksort
  end

  array = [15, 23, 1, 9, 10, 2, 5]
  p array.quicksort
end

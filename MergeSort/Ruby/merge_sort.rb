class Array
  def merge_sort
    return self if self.length <= 1

    middle = (self.length / 2).to_i
    left = self[0..middle-1].merge_sort
    right = self[middle..self.length-1].merge_sort

    return merge(left, right)
  end

  def merge(left, right)
    result = Array.new

    while left.length > 0 || right.length > 0
      if left.length > 0 && right.length > 0
        if left[0] <= right[0]
          result << left.slice!(0)
        else
          result << right.slice!(0)
        end
      elsif left.length > 0
        result.concat left.slice!(0..left.length-1)
      elsif right.length > 0
        result.concat right.slice!(0..right.length-1)
      end
    end

    return result
  end
end

random_names = File.readlines("randomnames.txt")
puts random_names.merge_sort
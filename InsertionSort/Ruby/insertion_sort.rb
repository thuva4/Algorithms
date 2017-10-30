
def insertion_sort(input)
  input.size.times do |i|
    j = i-1
    curr_element = input[i]
    while j >= 0 && input[j] > curr_element do
      input[j+1] = input[j]
      j -= 1
    end
    input[j+1] = curr_element
  end
end

input = [7, 6, 5, 9, 8, 4, 3, 1, 2, 0, 5]
insertion_sort(input)
puts input

numbers =  Array.new(10) { rand(1...1000) }
gap = numbers.length / 2
#sort
while gap > 0 do
  i = gap
  while i < numbers.length do
    temp = numbers[i]
    j = i
    while j >= gap &&  numbers[j-gap] > temp do
      numbers[j] = numbers[j-gap]
      j-=gap
    end
    numbers[j] = temp
    i+=1
  end
  	
  gap = gap / 2
end

print numbers
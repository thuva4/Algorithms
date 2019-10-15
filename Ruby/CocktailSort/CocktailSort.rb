def sort(array)
	swap = true
	begining = 0
	ending = array.length-1
	while(swap)
		swap = false
		begining.upto ending-1 do |i|
			if(array[i] > array[i+1])
				aux = array[i]
				array[i] = array[i+1]
				array[i+1] = aux
				swap = true
			end
		end
		ending -= 1
		ending.downto begining+1 do |i|
			if(array[i] < array[i-1])
				aux = array[i]
				array[i] = array[i-1]
				array[i-1] = aux
				swap = true
			end
		end
		begining += 1
	end
	return array
end	swap = true
	begining = 0
	ending = array.length-1
	while(swap)
		swap = false
		begining.upto ending-1 do |i|
			if(array[i] > array[i+1])
				aux = array[i]
				array[i] = array[i+1]
				array[i+1] = aux
				swap = true
			end
		end
		ending -= 1
		ending.downto begining+1 do |i|
			if(array[i] < array[i-1])
				aux = array[i]
				array[i] = array[i-1]
				array[i-1] = aux
				swap = true
			end
		end
		begining += 1
	end
	return array
ende

# Implementation using array index
def linear_search(array, key)
    if array.index(key).nil?
        return "Key #{key} not found"
    else
        return "Key #{key} found at Index #{array.index(key)}"
    end
end

# Implementation using iteration
def linear_search_iterative(array, key)
    i = 0
    while i < array.length
        if array[i] == key
            return "Key #{key} found at Index #{array.index(key)}"
        end
        i+=1
    end
    return "Key #{key} not found"
end

arr = [7, 6, 25, 19, 8, 14, 3, 16, 2, 0]
key = 25

p linear_search(arr, key)
p linear_search_iterative(arr, key)
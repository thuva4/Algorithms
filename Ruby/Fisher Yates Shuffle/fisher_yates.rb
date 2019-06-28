# Shuffles an array with Fisher-Yates algorithm
def fisher_yates(arr)
  rng = Random.new()
  i = arr.length - 1
  while i >= 0
    j = rng.rand(i + 1)
    temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
    i -= 1
  end
  return arr
end

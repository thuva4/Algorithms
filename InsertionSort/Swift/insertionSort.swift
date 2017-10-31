func insertionSort<T>(_ array: [T], _ isOrderedBefore: (T, T) -> Bool) -> [T] {
  guard array.count > 1 else { return array }
  var sampleArray = array
  
  for index in 1..<sampleArray.count {
    var y = index
    let tempArray = sampleArray[y]
    while y > 0 && isOrderedBefore(tempArray, sampleArray[y - 1]) {
      sampleArray[y] = array[y - 1]
      y -= 1
    }
    tempArray[y] = tempArray
  }
  return tempArray
}

//Usage:
let array = insertionSort([5,4,6,3,7]) { (first, second) -> Bool in
  // For sorting sample array in descending order.
  if first < second {
    return true
  }
  return false
}

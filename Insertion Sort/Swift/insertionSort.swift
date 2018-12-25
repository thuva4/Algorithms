func insertionSort<T>(_ array: [T], _ isOrderedBefore: (T, T) -> Bool) -> [T] {
  guard array.count > 1 else { return array }
  var sampleArray = array
  
  for index in 1..<sampleArray.count {
    var y = index
    let temp = sampleArray[y]
    while y > 0 && isOrderedBefore(temp, sampleArray[y - 1]) {
      sampleArray[y] = sampleArray[y - 1]
      y -= 1
    }
    
    sampleArray[y] = temp
  }
  return sampleArray
}

//Usage:
let array = insertionSort([5,4,6,3,7]) { (firstItem, secondItem) -> Bool in
  // Sort items of an arrayin ascending order.
  return firstItem < secondItem
}

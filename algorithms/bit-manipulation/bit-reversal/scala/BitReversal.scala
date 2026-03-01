object BitReversal {

  def bitReversal(n: Long): Long = {
    var value = (n & 0xFFFFFFFFL).toInt
    var result = 0L
    for (_ <- 0 until 32) {
      result = (result << 1) | (value & 1)
      value >>>= 1
    }
    result & 0xFFFFFFFFL
  }
}

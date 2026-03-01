object PowerOfTwoCheck {

  def powerOfTwoCheck(n: Int): Int = {
    if (n <= 0) 0
    else if ((n & (n - 1)) == 0) 1
    else 0
  }
}

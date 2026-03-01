object RopeDataStructure {
  def ropeDataStructure(data: Array[Int]): Int = {
    val n1 = data(0)
    val arr1 = data.slice(1, 1 + n1)
    val pos = 1 + n1
    val n2 = data(pos)
    val arr2 = data.slice(pos + 1, pos + 1 + n2)
    val queryIndex = data(pos + 1 + n2)

    if (queryIndex < n1) arr1(queryIndex) else arr2(queryIndex - n1)
  }

  def main(args: Array[String]): Unit = {
    println(ropeDataStructure(Array(3, 1, 2, 3, 2, 4, 5, 0)))
    println(ropeDataStructure(Array(3, 1, 2, 3, 2, 4, 5, 4)))
    println(ropeDataStructure(Array(3, 1, 2, 3, 2, 4, 5, 3)))
  }
}

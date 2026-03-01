import scala.collection.mutable

object CuckooHashing {
  def cuckooHashing(data: Array[Int]): Int = {
    val n = data(0)
    if (n == 0) return 0

    val capacity = math.max(2 * n, 11)
    val table1 = Array.fill(capacity)(-1)
    val table2 = Array.fill(capacity)(-1)
    val inserted = mutable.Set[Int]()

    def h1(key: Int): Int = ((key % capacity) + capacity) % capacity
    def h2(key: Int): Int = (((key / capacity + 1) % capacity) + capacity) % capacity

    for (i <- 1 to n) {
      val key = data(i)
      if (!inserted.contains(key)) {
        if (table1(h1(key)) == key || table2(h2(key)) == key) {
          inserted += key
        } else {
          var current = key
          var success = false
          var iter = 0
          while (iter < 2 * capacity && !success) {
            val pos1 = h1(current)
            if (table1(pos1) == -1) {
              table1(pos1) = current
              success = true
            } else {
              val tmp1 = table1(pos1)
              table1(pos1) = current
              current = tmp1

              val pos2 = h2(current)
              if (table2(pos2) == -1) {
                table2(pos2) = current
                success = true
              } else {
                val tmp2 = table2(pos2)
                table2(pos2) = current
                current = tmp2
              }
            }
            iter += 1
          }
          if (success) inserted += key
        }
      }
    }
    inserted.size
  }

  def main(args: Array[String]): Unit = {
    println(cuckooHashing(Array(3, 10, 20, 30)))
    println(cuckooHashing(Array(4, 5, 5, 5, 5)))
    println(cuckooHashing(Array(5, 1, 2, 3, 4, 5)))
  }
}

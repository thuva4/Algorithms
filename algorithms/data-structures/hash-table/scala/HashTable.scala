import scala.collection.mutable

object HashTable {

  private val TableSize = 64

  private class HashTableImpl {
    private val buckets: Array[mutable.ListBuffer[(Int, Int)]] =
      Array.fill(TableSize)(mutable.ListBuffer.empty)

    private def hash(key: Int): Int = math.abs(key) % TableSize

    def put(key: Int, value: Int): Unit = {
      val idx = hash(key)
      val bucket = buckets(idx)
      val pos = bucket.indexWhere(_._1 == key)
      if (pos >= 0) {
        bucket(pos) = (key, value)
      } else {
        bucket += ((key, value))
      }
    }

    def get(key: Int): Int = {
      val idx = hash(key)
      buckets(idx).find(_._1 == key).map(_._2).getOrElse(-1)
    }

    def delete(key: Int): Unit = {
      val idx = hash(key)
      val bucket = buckets(idx)
      val pos = bucket.indexWhere(_._1 == key)
      if (pos >= 0) {
        bucket.remove(pos)
      }
    }
  }

  def hashTableOps(operations: Array[Int]): Int = {
    val table = new HashTableImpl
    val opCount = operations(0)
    var resultSum = 0
    var idx = 1

    for (_ <- 0 until opCount) {
      val opType = operations(idx)
      val key = operations(idx + 1)
      val value = operations(idx + 2)
      idx += 3

      opType match {
        case 1 => table.put(key, value)
        case 2 => resultSum += table.get(key)
        case 3 => table.delete(key)
        case _ =>
      }
    }

    resultSum
  }
}

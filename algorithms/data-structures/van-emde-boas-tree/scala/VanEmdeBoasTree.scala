import scala.collection.mutable.TreeSet
import scala.collection.mutable.ArrayBuffer

object VanEmdeBoasTree {
  def vanEmdeBoasTree(data: Array[Int]): Array[Int] = {
    val u = data(0)
    val nOps = data(1)
    val set = TreeSet[Int]()
    val results = ArrayBuffer[Int]()
    var idx = 2
    for (_ <- 0 until nOps) {
      val op = data(idx)
      val v = data(idx + 1)
      idx += 2
      op match {
        case 1 => set += v
        case 2 => results += (if (set.contains(v)) 1 else 0)
        case 3 =>
          set.rangeFrom(v + 1).headOption match {
            case Some(s) => results += s
            case None    => results += -1
          }
      }
    }
    results.toArray
  }

  def main(args: Array[String]): Unit = {
    println(vanEmdeBoasTree(Array(16, 4, 1, 3, 1, 5, 2, 3, 2, 7)).mkString(", "))
    println(vanEmdeBoasTree(Array(16, 6, 1, 1, 1, 4, 1, 9, 2, 4, 3, 4, 3, 9)).mkString(", "))
  }
}

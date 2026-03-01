import scala.collection.mutable

object AhoCorasick {
  class TrieNode {
    val children: mutable.Map[Char, Int] = mutable.Map()
    var fail: Int = 0
    val output: mutable.ListBuffer[Int] = mutable.ListBuffer()
  }

  class Automaton(patterns: Array[String]) {
    private val trie: mutable.ArrayBuffer[TrieNode] = mutable.ArrayBuffer(new TrieNode)

    buildTrie()
    buildFailLinks()

    private def buildTrie(): Unit = {
      for (i <- patterns.indices) {
        var cur = 0
        for (c <- patterns(i)) {
          if (!trie(cur).children.contains(c)) {
            trie(cur).children(c) = trie.size
            trie += new TrieNode
          }
          cur = trie(cur).children(c)
        }
        trie(cur).output += i
      }
    }

    private def buildFailLinks(): Unit = {
      val queue = mutable.Queue[Int]()
      for ((_, child) <- trie(0).children) {
        trie(child).fail = 0
        queue.enqueue(child)
      }
      while (queue.nonEmpty) {
        val u = queue.dequeue()
        for ((c, v) <- trie(u).children) {
          var f = trie(u).fail
          while (f != 0 && !trie(f).children.contains(c)) f = trie(f).fail
          val fc = trie(f).children.getOrElse(c, -1)
          trie(v).fail = if (fc != -1 && fc != v) fc else 0
          trie(v).output ++= trie(trie(v).fail).output
          queue.enqueue(v)
        }
      }
    }

    def search(text: String): List[(String, Int)] = {
      var results = List[(String, Int)]()
      var cur = 0
      for (i <- text.indices) {
        val c = text(i)
        while (cur != 0 && !trie(cur).children.contains(c)) cur = trie(cur).fail
        trie(cur).children.get(c) match {
          case Some(next) => cur = next
          case None =>
        }
        for (idx <- trie(cur).output) {
          results = results :+ (patterns(idx), i - patterns(idx).length + 1)
        }
      }
      results
    }
  }

  def main(args: Array[String]): Unit = {
    val ac = new Automaton(Array("he", "she", "his", "hers"))
    val results = ac.search("ahishers")
    for ((word, index) <- results) {
      println(s"""Word "$word" found at index $index""")
    }
  }
}

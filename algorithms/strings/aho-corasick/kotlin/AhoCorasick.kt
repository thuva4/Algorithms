import java.util.LinkedList

fun ahoCorasickSearch(text: String, patternsLine: String): List<List<Any>> {
    val patterns = patternsLine.split(" ").filter { it.isNotEmpty() }
    val patternOrder = patterns.withIndex().associate { it.value to it.index }
    return AhoCorasick(patterns.toTypedArray())
        .search(text)
        .sortedWith(
            compareBy<Pair<String, Int>>(
                { it.second + it.first.length - 1 },
                { patternOrder[it.first] ?: Int.MAX_VALUE },
            ),
        )
        .map { (word, index) -> listOf(word, index) }
}

class AhoCorasick(private val patterns: Array<String>) {
    private val goTo: Array<IntArray>
    private val fail: IntArray
    private val output: Array<MutableList<Int>>
    private var states: Int = 1

    init {
        val maxStates = patterns.sumOf { it.length } + 1
        goTo = Array(maxStates) { IntArray(26) { -1 } }
        fail = IntArray(maxStates)
        output = Array(maxStates) { mutableListOf() }
        buildTrie()
        buildFailLinks()
    }

    private fun buildTrie() {
        for (i in patterns.indices) {
            var cur = 0
            for (c in patterns[i]) {
                val ch = c - 'a'
                if (goTo[cur][ch] == -1) {
                    goTo[cur][ch] = states++
                }
                cur = goTo[cur][ch]
            }
            output[cur].add(i)
        }
    }

    private fun buildFailLinks() {
        val queue = LinkedList<Int>()
        for (c in 0 until 26) {
            if (goTo[0][c] != -1) {
                fail[goTo[0][c]] = 0
                queue.add(goTo[0][c])
            } else {
                goTo[0][c] = 0
            }
        }
        while (queue.isNotEmpty()) {
            val u = queue.poll()
            for (c in 0 until 26) {
                if (goTo[u][c] != -1) {
                    val v = goTo[u][c]
                    var f = fail[u]
                    while (f != 0 && goTo[f][c] == -1) f = fail[f]
                    fail[v] = if (goTo[f][c] != -1 && goTo[f][c] != v) goTo[f][c] else 0
                    output[v].addAll(output[fail[v]])
                    queue.add(v)
                }
            }
        }
    }

    fun search(text: String): List<Pair<String, Int>> {
        val results = mutableListOf<Pair<String, Int>>()
        var cur = 0
        for (i in text.indices) {
            val ch = text[i].lowercaseChar()
            if (ch !in 'a'..'z') {
                cur = 0
                continue
            }
            val c = ch - 'a'
            while (cur != 0 && goTo[cur][c] == -1) cur = fail[cur]
            if (goTo[cur][c] != -1) cur = goTo[cur][c]
            for (idx in output[cur]) {
                results.add(Pair(patterns[idx], i - patterns[idx].length + 1))
            }
        }
        return results
    }
}

fun main() {
    val ac = AhoCorasick(arrayOf("he", "she", "his", "hers"))
    val results = ac.search("ahishers")
    for ((word, index) in results) {
        println("Word \"$word\" found at index $index")
    }
}

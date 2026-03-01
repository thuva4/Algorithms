class TrieNode:
    def __init__(self) -> None:
        self.children: dict[str, TrieNode] = {}
        self.is_end: bool = False


def _insert(root: TrieNode, key: int) -> None:
    node = root
    for ch in str(key):
        if ch not in node.children:
            node.children[ch] = TrieNode()
        node = node.children[ch]
    node.is_end = True


def _search(root: TrieNode, key: int) -> bool:
    node = root
    for ch in str(key):
        if ch not in node.children:
            return False
        node = node.children[ch]
    return node.is_end


def trie_insert_search(arr: list[int]) -> int:
    n = len(arr)
    mid = n // 2
    root = TrieNode()

    for i in range(mid):
        _insert(root, arr[i])

    count = 0
    for i in range(mid, n):
        if _search(root, arr[i]):
            count += 1

    return count

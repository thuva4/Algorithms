class TrieNode {
    children: Map<string, TrieNode> = new Map();
    isEnd: boolean = false;
}

function insert(root: TrieNode, key: number): void {
    let node = root;
    for (const ch of String(key)) {
        if (!node.children.has(ch)) {
            node.children.set(ch, new TrieNode());
        }
        node = node.children.get(ch)!;
    }
    node.isEnd = true;
}

function search(root: TrieNode, key: number): boolean {
    let node = root;
    for (const ch of String(key)) {
        if (!node.children.has(ch)) {
            return false;
        }
        node = node.children.get(ch)!;
    }
    return node.isEnd;
}

export function trieInsertSearch(arr: number[]): number {
    const n = arr.length;
    const mid = Math.floor(n / 2);
    const root = new TrieNode();

    for (let i = 0; i < mid; i++) {
        insert(root, arr[i]);
    }

    let count = 0;
    for (let i = mid; i < n; i++) {
        if (search(root, arr[i])) {
            count++;
        }
    }

    return count;
}

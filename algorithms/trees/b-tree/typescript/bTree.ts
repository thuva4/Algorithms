const T = 3;
const MAX_KEYS = 2 * T - 1;

class BTreeNode {
    keys: number[] = [];
    children: BTreeNode[] = [];
    leaf: boolean;

    constructor(leaf: boolean = true) {
        this.leaf = leaf;
    }
}

function splitChild(parent: BTreeNode, i: number): void {
    const full = parent.children[i];
    const newNode = new BTreeNode(full.leaf);
    newNode.keys = full.keys.splice(T);
    parent.keys.splice(i, 0, full.keys.pop()!);
    if (!full.leaf) {
        newNode.children = full.children.splice(T);
    }
    parent.children.splice(i + 1, 0, newNode);
}

function insertNonFull(node: BTreeNode, key: number): void {
    if (node.leaf) {
        let i = node.keys.length - 1;
        node.keys.push(0);
        while (i >= 0 && key < node.keys[i]) {
            node.keys[i + 1] = node.keys[i];
            i--;
        }
        node.keys[i + 1] = key;
    } else {
        let i = node.keys.length - 1;
        while (i >= 0 && key < node.keys[i]) i--;
        i++;
        if (node.children[i].keys.length === MAX_KEYS) {
            splitChild(node, i);
            if (key > node.keys[i]) i++;
        }
        insertNonFull(node.children[i], key);
    }
}

function inorder(node: BTreeNode | null, result: number[]): void {
    if (!node) return;
    for (let i = 0; i < node.keys.length; i++) {
        if (!node.leaf) inorder(node.children[i], result);
        result.push(node.keys[i]);
    }
    if (!node.leaf) inorder(node.children[node.keys.length], result);
}

export function bTree(arr: number[]): number[] {
    if (arr.length === 0) return [];
    let root = new BTreeNode(true);
    for (const val of arr) {
        if (root.keys.length === MAX_KEYS) {
            const newRoot = new BTreeNode(false);
            newRoot.children.push(root);
            splitChild(newRoot, 0);
            root = newRoot;
        }
        insertNonFull(root, val);
    }
    const result: number[] = [];
    inorder(root, result);
    return result;
}

class SplayNode {
    key: number;
    left: SplayNode | null = null;
    right: SplayNode | null = null;
    constructor(key: number) { this.key = key; }
}

function rightRotate(x: SplayNode): SplayNode {
    const y = x.left!;
    x.left = y.right;
    y.right = x;
    return y;
}

function leftRotate(x: SplayNode): SplayNode {
    const y = x.right!;
    x.right = y.left;
    y.left = x;
    return y;
}

function splayOp(root: SplayNode | null, key: number): SplayNode | null {
    if (!root || root.key === key) return root;
    if (key < root.key) {
        if (!root.left) return root;
        if (key < root.left.key) {
            root.left.left = splayOp(root.left.left, key);
            root = rightRotate(root);
        } else if (key > root.left.key) {
            root.left.right = splayOp(root.left.right, key);
            if (root.left.right) root.left = leftRotate(root.left);
        }
        return root.left ? rightRotate(root) : root;
    } else {
        if (!root.right) return root;
        if (key > root.right.key) {
            root.right.right = splayOp(root.right.right, key);
            root = leftRotate(root);
        } else if (key < root.right.key) {
            root.right.left = splayOp(root.right.left, key);
            if (root.right.left) root.right = rightRotate(root.right);
        }
        return root.right ? leftRotate(root) : root;
    }
}

function insertNode(root: SplayNode | null, key: number): SplayNode {
    if (!root) return new SplayNode(key);
    root = splayOp(root, key)!;
    if (root.key === key) return root;
    const node = new SplayNode(key);
    if (key < root.key) {
        node.right = root;
        node.left = root.left;
        root.left = null;
    } else {
        node.left = root;
        node.right = root.right;
        root.right = null;
    }
    return node;
}

function inorderCollect(node: SplayNode | null, result: number[]): void {
    if (!node) return;
    inorderCollect(node.left, result);
    result.push(node.key);
    inorderCollect(node.right, result);
}

export function splayTree(arr: number[]): number[] {
    let root: SplayNode | null = null;
    for (const val of arr) root = insertNode(root, val);
    const result: number[] = [];
    inorderCollect(root, result);
    return result;
}
